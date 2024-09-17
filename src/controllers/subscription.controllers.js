import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
// import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"
// import { getCurrentUser } from "./user.controllers.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    if(!channelId) throw new ApiError(400,"Couldn't find channelId")
    const currentUserId = req.user._id
    if(!currentUserId) throw new ApiError(400,"You are not authenticated to make this request")
    
        const existingSubscription = await Subscription.findOne({
            subscriber : currentUserId,
            channel    : channelId
        })
        if(existingSubscription) 
        {

            await Subscription.deleteOne({ _id: existingSubscription._id });
            return  res 
                    .status(200)
                    .json(new ApiResponse(200,existingSubscription,"Subscription removed succesfully"))
        }
        else 
        {
            await Subscription.create(existingSubscription)
            return res 
                    .status(201)
                    .json(new ApiResponse(200,existingSubscription,"Subscription removed successfully"))
        }

    // TODO: toggle subscription
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    if(!channelId) throw new ApiError(400,"Couldn't find channelId")
    const subscriberList = await Subscription.find( {channel : channelId})
    if(!subscriberList) 
        return res
                .status(200)
                .json(new ApiResponse(200,[],"No subscribers Found"))
    else 
        return res  
                .status(200)
                .json(new ApiResponse(200,subscriberList,"Subscribers List fetched Successfully"))

})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    if(!subscriberId) throw new ApiError(400,"Couldn't find subscriberId")
    
    const subscribedChannelList = await Subscription.find( {subscriber : subscriberId })

    return res
            .status(200)
            .json(new ApiResponse(200,subscribedChannelList,"Channels user has subscribed To sucessfully fetched"))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}