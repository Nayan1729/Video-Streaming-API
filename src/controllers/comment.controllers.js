import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
    const pageNum = parseInt(page, 10)
    const limitNum = parseInt(limit, 10)

    // Validate the page and limit parameters
    if (isNaN(pageNum) || pageNum < 1) {
        throw new Error('Invalid page number')
    }
    if (isNaN(limitNum) || limitNum < 1) {
        throw new Error('Invalid limit number')
    }
    const aggregate = await Comment.aggregate([
        {$match: {
            video : videoId
        } }
    ])
    const options = {
        page : pageNum , limit : limitNum
    }
    const result = await Comment.aggregatePaginate(aggregate, options);
    return res
            .status(200)
            .json(new ApiResponse(200,{
                data: result.docs, //  Passing the 10 documents 
                page: result.page, // Page no
                limit: result.limit, 
                totalDocs: result.totalDocs,
                totalPages: result.totalPages,
                hasNextPage: result.hasNextPage,
                hasPrevPage: result.hasPrevPage
            },
            "Video comments fetched successfully"
        ))
})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {videoId}  = req.params
    const {content}  = req.body
    const userId = req.user._id
    if(!videoId) throw new ApiError(400,"Invalid videoId")
    if (!content) throw new ApiError(400, "Content is required")
    
    const comment = await Comment.create({
        content,
         video : videoId,
         owner : userId
    })
    return res
            .status(201)
            .json(new ApiResponse(200,comment,"Comment created"))
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {videoId}  = req.params
    const {content}  = req.body
    const userId     = req.user._id
    if(!videoId) throw new ApiError(400,"Invalid videoId")
    if (!content) throw new ApiError(400, "Content is required")
    const commentUpdated = await findByIdAndupdate({
        content, video : videoId,
        owner : userId
    },
    {new : true}
)
    return res
            .status(200)
            .json(new ApiResponse(200,commentUpdated,"Comment updated successfully"))
    
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const { commentId } = req.params;
    const userId = req.user._id;
    const commentToDelete = await Comment.findByIdAndDelete({_id : commentId , owner : userId })
    if(!commentToDelete) throw new ApiError(400,"No comment found to delete")
    return res
            .status(200)
            .json(new ApiResponse(200,{},"Comment deleted successfully"))
})

export {
    getVideoComments, 
    addComment,
    updateComment,
     deleteComment
}