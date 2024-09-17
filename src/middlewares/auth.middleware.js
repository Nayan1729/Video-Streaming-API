import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js"; 
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
/*
    The reason we do this is  because we want to log out a user
    To do that we will have to get _id of that user 
    Now how do we get that ?
    We as such dont have a form for logout with which we can get the email of the user and then match it with the id 
    So we will have to use cookies of the user to access that
*/
/*
    Now in mobile applications we dont have access to the access tokens in cookies
        -- Mobile applications, however, do not use browsers in the same way and typically store session information and tokens in different ways
           such as in-memory storage or encrypted storage within the app itself
    So in mobile application a header is send with the key name Authorization and value as "Bearer AccessTokenVal"
    The authorization header is usually required for authenticated requests(such as logout) to ensure the user is properly identified.
    So we have to check for accesstoken as well as authorization header
*/
export const verifyJWT = asyncHandler (async (req,res,next)=>{
      try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
        if(!token) throw new ApiError(401,"Unauthorized request")
  
          const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET) 
          console.log(`decodedToken: ${decodedToken}`);
          // When we get the decoded token we can get the _id by the simply decodedToken._id as it is a object
          const user =  await User.findById(decodedToken?._id).select("-password -refreshToken") 
          if(!user) throw new ApiError(401,"Invalid AccessToken") 
              req.user = user; // This is crazy shit 
          next();
           /*
            Now as this is a middleware function with access to req we can add a new property of user to req
            which will be accessed by the function after this and then the next function will have access to
            req.user._id And boom we now have access to the user that is trying to logout
        */
      } catch (error) {
            throw new ApiError("401",error.message || "ERRRRR!!!!  Invalid Access Token" )
      }
       
})
