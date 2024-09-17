import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    if(!videoId) throw new ApiError(400,"Couln't find videoId")
    const userId = req.user._id
    const isAlreadyLiked = await Like.findOne(
        {owner : userId},{ video : videoId }
    
    )
    if(isAlreadyLiked)
        {
            await isAlreadyLiked.deleteOne()
            return res
                    .status(200)
                    .json(new ApiResponse(200,{},"Video disliked successfully"))
        } 
        else
        {
            const likedVideo = await Like.create({video : videoId , likedBy:userId })
            
            return res
                    .status(201)
                    .json(new ApiResponse(200,likedVideo,"Video liked successfully"))
        }
    //TODO: toggle like on video
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    if(!commentId) throw new ApiError(400,"Couln't find commentId")
    const userId = req.user._id
    const isAlreadyLiked = await Like.findOne(
        {owner : userId},{ comment : commentId }
    
    )
    if(isAlreadyLiked)
        {
            await isAlreadyLiked.deleteOne()
            return res
                    .status(200)
                    .json(new ApiResponse(200,{},"Comment disliked successfully"))
        } 
        else
        {
            const likedComment = await Like.create({comment : commentId , likedBy : userId })
            
            return res
                    .status(201)
                    .json(new ApiResponse(200,likedComment,"Video liked successfully"))
        }

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    if(!tweetId) throw new ApiError(400,"Couln't find tweetId")
        const userId = req.user._id
        const isAlreadyLiked = await Like.findOne(
            {owner : userId},{ tweet : tweetId }
        
        )
        if(isAlreadyLiked)
            {
                await isAlreadyLiked.deleteOne()
                return res
                        .status(200)
                        .json(new ApiResponse(200,{},"Tweet disliked successfully"))
            } 
            else
            {
                const likedComment = await Like.create({tweet : tweetId , likedBy : userId })
                
                return res
                        .status(201)
                        .json(new ApiResponse(200,likedComment,"Tweet liked successfully"))
            }
    
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
   
        const userId = req.user._id
        /*
        Populate Video Details: The .populate('video') method is used to replace the video reference with the actual video document details from the Video collection.

        Here we need to make sure to populate the videos field as that would give out the actual video details 
        There id another way but this would simply help us fetch the liked videos in one manual query
        */
        const likedVideos = await Like.find({likedBy : userId ,video : {$exists : true}}).populate('video')
        if(!likedVideos.length) throw new ApiResponse(200,{},"No liked Videos found")
         
        
            // Extract video details from the liked videos
            const videos = likedVideos.map(like => like.video);
            return res.status(200).json(new ApiResponse(200, videos, "Liked videos retrieved successfully"))
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}