import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import ApiRespose from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import { extractPublicId } from 'cloudinary-build-url'
const options =  { // Options have to be added to send cookies
  httpOnly: true,
  secure: true // By turning secure on the cookies will only be modifiable at the server and not at the front end Thus making it secure
}
  const generateAccessAndRefreshToken =  async (userID)=>{
    try {
      // console.log(userID)
      const user         = await User.findById(userID)
      console.log(user._id)
      const accessToken  =  await  user.generateAccessToken()
      console.log(`Access Token : ${accessToken}`)

      const refreshToken = await  user.generateRefreshToken()
      console.log(`Refresh Token : ${refreshToken}`)
      user.refreshToken  = refreshToken
      await user.save()
      return {accessToken,refreshToken}; 
    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating Access and Refresh Token")
    }
  }
// Now how to resiter a user
   /*
        -- First take data from frontend 
        --Validate that every required field is filled 
        --Next make sure that the user is registering for the first time(use email or username for that)
        --Once u get that data follow along
        --Upload image and avatar to cloudinary and get the url reference
        --Create userObject and create entry in db
        --remove and refreshToken field from response(Whenever we make a entry in mongo whatever we give is returned so we must remove the password field)
        --Check for userCreation(if created u will get user object will get user object with all the field and if not u will get null in return)
        --return res
   */
const registerUser = asyncHandler (async (req,res)=>{
    // Get data from user 

   const {username,email,fullname,password} = req.body; 

   //Validation

    if( [fullname,email,username,password].some((field) => field?.trim() ==="" ) ) // If for any field, field.trim is empty then throw error
        {
            throw new ApiError(400,"All fields are required")
        }

    //Check is User already exists 

   const existedUser = await User.findOne({ // User model gives us access to query in our database
        $or : [{username},{email}]
    })
    if(existedUser) throw new ApiError(409,"User already exists")
    
        // Access files 
        // multer gives the req additional property by files

/*
             ####################                   req.files contains              ############################
{
  "avatar": [
    {
      "fieldname": "avatar",
      "originalname": "Screenshot (6).png",
      "encoding": "7bit",
      "mimetype": "image/png",
      "destination": "./public/temp",
      "filename": "Screenshot (6).png",
      "path": "public\\temp\\Screenshot (6).png",
      "size": 278059
    }
  ],
  "coverImage": [
    {
      "fieldname": "coverImage",
      "originalname": "sc3.png",
      "encoding": "7bit",
      "mimetype": "image/png",
      "destination": "./public/temp",
      "filename": "sc3.png",
      "path": "public\\temp\\sc3.png",
      "size": 278059
    }
  ]
}
  To access avatar we use req.files.avatar 
  Now avatar is an array.
  The reason it has only one object in it is because while uploading we set  maxCount as 1 (see user.routes.js)    
 */

        console.log(req.files)
       const avatarLocalPath = req.files?.avatar[0]?.path // Reason for avatar[0] is above
       console.log(`Avatar local Storage path  ${avatarLocalPath}`)
    //    const coverImageLocalPath = req.files?.coverImage[0]?.path  Cant use this as coverImage is not mandatory 
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0 ){
            coverImageLocalPath = req.files.coverImage[0].path
    }
       console.log(`CoverImage local Storage path ${coverImageLocalPath}`)

        
       if(!avatarLocalPath) throw new ApiError(400,"Avatar file is required")
        
        // Upload on cloudinary 
        const avatar = await uploadOnCloudinary(avatarLocalPath)
        
        const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    
        //Since avatar is a required field again check if avatar is uploaded on cloudinary
        if(!avatar) throw new ApiError(400,"Avatar file is required ")

            // Create user object 
           
         const user = await User.create({
                fullname,
                avatar : avatar.url,
                coverImage : coverImage?.url || "", // since cover image is not compulsory (if it is present take its url or else keep it null)
                email,
                password,
                username:username.toLowerCase(),
            })

            // Remove password from response 

            const createdUser = await User.findById(user._id).select(" -password -refreshToken") ;  // This select method with the help of - will remove password and refreshToken 
            //Check for user Creation

             if(!createdUser) throw new ApiError(500,"Something went wrong while creating user")
            return res.status(201).json(new ApiRespose(200, createdUser,"User Registered Successfully"))
            


})
// Now how to login
/*
      -- First take the required fields
      -- Now check if user exists and if it does then also check if the password entered is correct
      -- If password entered is correct generate access and refresh token
      -- When generated send tokens in cookies

*/
const loginUser = asyncHandler(async(req,res)=>{

  const {username,email,password} = req.body

  //Check if either of them is provided

  if(!username && !email ){throw new ApiError(400,"Username or email required")}

  // Now find user based on email or username as both are unique
  
  const user = await User.findOne({
    $or : [{username},{email}]
  })
  if(!user) throw new ApiError(400,"User doesn't exist")

    const isPasswordValid = await user.isPasswordCorrect(password)
    //Check if password is valid
    if(!isPasswordValid) throw new ApiError(400,"Invalid Password")
      console.log(user);
      const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id)
      // Now we have to update user to the logged in user 
      console.log(`refresh Token ${refreshToken}`);
      const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
      // OPtions are included in the global scope
      console.log(loggedInUser);
      return res
                .status(200)
                .cookie("accessToken",accessToken,options)
                .cookie("refreshToken",refreshToken,options)
                .json(
                  new ApiRespose(200,{user:loggedInUser , accessToken ,refreshToken} ,"User Logged In Successsfully")
                     )
})
const logOutUser = asyncHandler (async (req,res)=>{
    await  User.findByIdAndUpdate(req.user._id,{
        $unset : {
          refreshToken : 1
        }
      },
        {
          new : true   // This means which value to return to the user 
        } // The new value or the the value before updating the details
    )
    /*
      By default, findByIdAndUpdate returns the document as it was before the update was applied. 
      Setting { new: true } tells Mongoose to return the modified document instead.
    */
    return res
            .status(200)
            .clearCookie("accessToken",options )
            .clearCookie("refreshToken",options)
            .json(new ApiRespose(200,{},"User logged out"))
})
  const refreshAccessToken = asyncHandler(async (req, res) => {
    let incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    /*
    Cookie-based Authentication: Many web applications use cookies to store tokens for authentication purposes because cookies are 
      automatically sent with every request to the server, simplifying the authentication process.

  Request Body: In some cases, especially in APIs or mobile applications, the refresh token might be sent in the body of a POST request. 
    This approach can be more secure in certain contexts, such as when dealing with cross-origin requests where cookies might not be sent.
    
    */
    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }
    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken, 
            process.env.REFRESH_TOKEN_SECRET
        )
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
            
        }
        
        const {accessToken, newRefreshToken} = await generateAccessAndRefreshToken(user._id)
        // This token has been saved in the database in the usre as well and it is only left to propogate it to the user in the form of cookie
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiRespose(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

  })
// Some important functions

const changeCurrentPassword = asyncHandler (async (req,res)=>{
  const {oldPassword,newPassword} = req.body

  // Now we know that the user is logged in for sure as it is able to change the password 
  // This means auth.middleware has installed req.user = user 
  // Thus we have access to user and hence their id
  const user = User.findById(req.user?._id)

  // In user.models we have this method 

  const isPasswordCorrect = user.isPasswordCorrect(oldPassword)
  if(!isPasswordCorrect) throw new ApiError(400,"Invalid old Password")
    await user.save()
  return res
            .status(200)
            .json(new ApiRespose(200,{},"Password changed successfully"))


})
const getCurrentUser = asyncHandler ( async(req,res)=>{
    return res
              .status(200)
              .json(new ApiRespose(200,req.user,"Current user fetched successfully"))
})

const updateAccountDetails = asyncHandler (async (req,res)=>{
  const {fullname,email} = req.body
  if (!(fullname && email)) throw new ApiError(400,"All fields are required")

    const user = User.findById(getCurrentUser()?._id,
    {
      $set : {
        fullname,email
      }
    },
    {new: true} // By passing new as true the user returned after this is the new updated user and not the one before the modification
  ).select("-password")
  
  return res
            .status(200)
            .json(new ApiRespose(200,user,"Account details Updated successfully"))
})

const updateUserAvatar = asyncHandler (async(req,res)=>{
  // before calling this method we will call multerMiddleware as it will give us reference to req.files when user sends us the updatedImage
  const avatarLocalPath = req.file?.path
  if(!avatarLocalPath) throw new ApiError(400,"Avatar file is missing")
  const avatar = await uploadOnCloudinary(avatarLocalPath) // THis will return the avatar object. We want the url
  if(!avatar) throw new ApiError(400,"Error while uploading avatar")

    const user = await  User.findById(req.user?._id)
  if(!user) throw new ApiError(400,"Couldnt find User")

  const public_id = extractPublicId(
    user.avatar
  ) 

  await cloudinary.v2.uploader.destroy(public_id, options) // Deleting the older avatar from existence
  user.avatar = avatar.url
  await user.save()

  return res 
            .status(200)
            .json(200,user,"Avatar Updated Successfully")
})

const updateCoverImageAvatar = asyncHandler (async(req,res)=>{
  // before calling this method we will call multerMiddleware as it will give us reference to req.files when user sends us the updatedImage
  const coverImageLocalPath = req.file?.path
  if(!coverImageLocalPath) throw new ApiError(400,"Avatar file is missing")
  const coverImage = await uploadOnCloudinary(coverImageLocalPath) // THis will return the avatar object. We want the url
  if(!coverImage) throw new ApiError(400,"Error while uploading avatar")
  
    const user = await  User.findById(req.user?._id)
    if(!user) throw new ApiError(400,"Couldnt find User")

    const public_id = extractPublicId(
      user.coverImage
    ) 

    await cloudinary.v2.uploader.destroy(public_id, options) // Deleting the older coverImage from existence
    user.coverImage = coverImage.url
    await user.save()

  return res 
            .status(200)
            .json(200,user,"Cover Image Updated Successfully")
})

const getUserChannelProfile = asyncHandler (async (req,res)=>{
  const {usernameOfChannel} = req.params // It is passed in the parameters 
  // This req.params (username) is the channel that a particular user has searched 

  if(!usernameOfChannel?.trim()) throw new ApiError(400,"Username is missing")

  const channel =   await User.aggregate ([
    {
      $match : username?.toLowerCase()   // All the documents of the following username will be fetched and passed to the next pipeline to perform operations
    },
    {
      $lookup : {                 // User and subscription schema is joined on id to find subscribers 
        from :  "subscriptions",  // Subscription is converted to subscriptions
        localField: "_id",
        foreignField: "channel", 
        as : "subscribers"
      } // Once we get all the documents(It will be in the form of array of objects) with the user's channelname we can simply calculate the count of those and get the subscribers count
    },
    {
      $lookup : {                 // User and subscription schema is joined on id to find subscribers 
        from :  "subscriptions",  // Subscription is converted to subscriptions
        localField: "_id",
        foreignField: "subscriber", 
        as : "subscriberdTo"
      } 
    },
    { // Inside all the documents we found from lookup and match these new fields are added
      $addFields : { // We add the following fields in the user by this operator 
        subscribersCount : { // By using the size operator we are finding the size of the subscribers array returned
          $size : "$subscribers" // As it is a field now
        },
        channelsSubscribedToCount : {
            $size : "$subscriberdTo"  
          },
          isSubscribed : {
            $cond : { // Now in this we take the current user that is logged in and check if he is in the subscriber list of the channel that the user has requested to view
              if : { $in : [req.user?._id,"$subscribers.subscriber"]}, // Current user , subscribers => new field(object) we found from lookup and .subscriber => to access the subscriber key
              then : true,
              else : false
            }
          }
          
      }
    },
    { //  Which fields from the user do u want to show in the output of this entire aggregation pipeline
      $project : {
        fullname : 1,
        username : 1,
        subscribersCount : 1,
        channelsSubscribedToCount : 1,
        isSubscribed : 1,
        avatar : 1,
        email : 1,
        createdAt : 1
      }
    }
  ])
  console.log(channel); 
  if(!channel?.length){
    throw new ApiError (404,"Channel Doesn't exist")
  }
  return res
            .status(200)
            .json(
              new ApiRespose(200,channel[0],"User channel fetched successfully")
            ) 
            /* 
                The reason we only pass channel[0] as the entire channel array returned has loads of documents but all the details needed 
                can be extracted from the first object only
            */
})
const getWatchHistory = asyncHandler(async(req,res)=>{
  const user = await User.aggregate([
    {
      $match : {_id :  mongoose.Types.ObjectId(req.user._id) } // Initally you had to use new keyword in here but now thats not the case
      // The use of this method is that _id is actually a string and req.user._id gives us the mongoose object Id instead 
      // Earlier we didnt need to use this as mongoose automatically converts ObjectId into string but aggregate pipelines code goes as it is
    },
    // Now once we get the user Id we can lookup and join
    {
      $lookup : {
        from          : "videos",
        localField    : "watchHistory",
        foreignField  : "_id", // id generated by mongodb database
        as            : "watchHistory",
        pipeline : [
          // Here if we stop here we won't get the owner field as it is supposed to be joined with user to get the owner of the videos
          // So now we are inside videos and we will apply a lookup in the users table with the help of pipeline 
                {
                  $lookup : {
                    from         : "users", 
                    localField   : "owner",
                    foreignField : "_id",
                    as           : "owner",
                    pipeline : [
                      { 
                        // Now we are inside users table so whatever we project will be the new owner field
                        $project : {
                          fullname : 1,
                          username : 1,
                          avatar   : 1 
                        }
                      }
                    ]
                  }
                },
                { 
                  /*
                    inside the addFields we can simply add the fields we want to add or we can override any existing field
                    here we are overriding the owner field 
                  */
                  $addFields : {
                    owner : { // With the help of this the owner which was an array is converted into a owner[0]
                      $first : "$owner"
                    } // Check what would have happened without this
                  }
                }
              ]
      }
    }
  ])
  return res
            .status(200)
            .json(
              new ApiRespose(200, user[0].watchHistory,"Watch History fetched successfully")
            )
})


export {
  registerUser,
  loginUser,
  logOutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  getUserChannelProfile,
  updateCoverImageAvatar,
  getWatchHistory
}; 
// Here we will be writting methods for userController(callbacks) so its better to not export anything as default