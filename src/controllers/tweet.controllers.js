import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet

    const {content} = req.body
    if(!content) throw new ApiError(400,"Content is required")
    const userId = req.user._id
    const tweet = await Tweet.create({
        content,owner : userId
    })
    if(!tweet) throw new ApiError(500,"Couldn't create tweet")
    return res
            .status(201)
            .json(new ApiResponse(200,tweet,"Tweet created successfully"))
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const userId = req.user._id
    const allUserTweets = await Tweet.find({owner : userId})
    if(!allUserTweets) return res.status(200).json(new ApiResponse(200,[],"No tweets found for the given user"))
    return res
            .status(200)
            .json(new ApiResponse(200,allUserTweets,"User Tweets fetched Successfully"))
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {tweetId} = req.params
    if(!tweetId) throw new ApiError(400,"Couldn't find tweetId in the URL")
    const userId    = req.user._id
    const {content} = req.body
    if(!content) throw new ApiError(400,"Content is required")
    const updatedTweet = await Tweet.findByIdAndUpdate(tweetId,{
        content,owner :userId
    },{new :true})
    if(!updateTweet) throw new ApiError(500,"Error while updating tweet") 
    return res
    .status(200)
    .json(new ApiResponse(200,allUserTweets,"Tweet updated Successfully"))
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId} = req.params
    if(!tweetId) throw new ApiError(400,"Couldn't find tweetId in the URL")
    const userId    = req.user._id
    const deleteTweet = await Tweet.findByIdAndDelete(tweetId)
    if(!deleteTweet) throw new ApiError(400,"No tweet found to delete")
    return res
            .status(200)
            .json(new ApiResponse(200,deleteTweet,"Tweet deleted successfully"))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}