import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { extractPublicId } from 'cloudinary-build-url'

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    // setting default sort parameters if nothing is provided
     sortType = req.query.sortType || "desc";
     sortBy   = req.query.sortBy   || "createdAt"

    //TODO: get all videos based on query, sort, pagination
    /*
        Regex(Regular Expression) for Search: Use regex to create a case-insensitive search pattern for the title and description fields.
        Example :   const regex = new RegExp(query, 'i'); // case-insensitive search
                    const pattern = /\d+/; // Matches one or more digits
                    const pattern = /./; // Matches any single character except newline
                    const startPattern = /^abc/; // Matches 'abc' at the start of a string
                    const endPattern = /abc$/; // Matches 'abc' at the end of a string        
    */
        // Convert page and limit to integers
        /*
            The $skip stage in an aggregation pipeline is used to skip a specified number of documents.
             In the context of pagination, {$skip: (pageNum - 1) * limitNum} skips the documents from previous pages to fetch the documents for the current page.
        
        */
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
    
        // Validate the page and limit parameters
        if (isNaN(pageNum) || pageNum < 1) {
            throw new Error('Invalid page number');
        }
        if (isNaN(limitNum) || limitNum < 1) {
            throw new Error('Invalid limit number');
        }
        const matchQuery = {}
    // Add text search if query is provided
        if (query) {
            const regex = new RegExp(query, 'i'); // case-insensitive search
            matchQuery.$or = [
                { title: { $regex: regex } },
                { description: { $regex: regex } }
            ];
        }
          // Filter by userId if provided
    if (userId && isValidObjectId(userId)) {
        matchQuery.owner = mongoose.Types.ObjectId(userId);
    }

    // Always filter to include only published videos
    matchQuery.isPublished = true;
    // Build the aggregation pipeline
    const pipeline = [
        { $match: matchQuery },
        { $sort: { [sortBy]: sortType === 'asc' ? 1 : -1 } },
        { $skip: (pageNum - 1) * limitNum },
        { $limit: limitNum }
    ];
    /*
        Exactly! Here's a brief explanation of how aggregate and aggregatePaginate work together:

        aggregate:

        Processes the query and applies the specified stages (like $match, $sort, $skip, $limit) to create a pipeline.
        Executes the pipeline on the MongoDB collection and returns the processed results.

        aggregatePaginate:
        Takes the aggregated pipeline and manages pagination.
        Splits the results into pages based on the provided options (like page and limit).
        Returns paginated results, including metadata about the pagination state.

        In summary:

        aggregate: Constructs and executes the query pipeline.
        aggregatePaginate: Handles the pagination of the results obtained from the aggregation.
    
    */
       // Paginate the results using mongoose-aggregate-paginate-v2
       const options = {
        page: pageNum,
        limit: limitNum
    };

    const aggregate = await Video.aggregate(pipeline);
    const result = await Video.aggregatePaginate(aggregate, options);

    // Send the response
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
            "Videos fetched successfully"
        ))
    /*
        Now make sure to send this detailed response as it is very useful in the frontend section where we would be applying scrollable 
        events which would be triggered because of the hasNextPage , limit and pages 
    */
})

const publishAVideo = asyncHandler(async (req, res) => {

    /*
        -- get the user from userId
        -- Now get the video they want to publish and put it in local Storage and then upload it on cloudinary as u will have access to 
           req.files from multer middleware and then UnSync it once uploaded on cloudinary
        -- 

    */
    const { title, description , thumbnail} = req.body
    // TODO: get video, upload to cloudinary, create video
    const user = await User.findById(req.user._id)
    if(!user) throw new ApiError(400,"Couldnt fetch Current User")
    
    if( [title, description , thumbnail].some((field) => field?.trim() ==="" ) ) // If for any field, field.trim is empty then throw error
    {
        throw new ApiError(400,"All fields are required")
    }
    const videoLocalPath = req.files?.videoFile[0]?.path
    if(!videoLocalPath) throw new ApiError(400,"Video file must be uploaded")
    const videoFile = await uploadOnCloudinary(videoLocalPath)
    if(!videoFile) throw new ApiError(500,"Couldn't upload video on cloudinary")
    const video = await Video.create({
        title , 
        videoFile : videoFile.url ,
        description,
        thumbnail,
        duration : videoFile.duration,
        owner : user._id
    })
    if(!video) throw new ApiError(500,"Error while creating user")
    return res
              .status(200)
              .json(new ApiResponse(200,video,"Video Published successfully"))
})
const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!videoId) throw new ApiError(400,"Video Id required to fetch video")
    const video = await Video.findById(videoId)
    if(!video) throw new ApiError(400,"Video Doesnt exist")
    return res
              .status(200)
              .json(new ApiResponse(200,video,"Video fetched successfully"))
    //TODO: get video by id
})

const updateVideoDetails = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!videoId) throw new ApiError(400,"VideoId not found")
    //TODO: update video details like title, description, thumbnail
    const { title, description, thumbnail, duration, isPublished } = req.body;

    // Create an update object containing only the fields that are provided in the request body
    const updateFields = {};
    if (title !== undefined) updateFields.title = title;
    if (description !== undefined) updateFields.description = description;
    if (thumbnail !== undefined) updateFields.thumbnail = thumbnail;
    if (duration !== undefined) updateFields.duration = duration;
    if (isPublished !== undefined) updateFields.isPublished = isPublished;

    try {
        const updatedVideo = await Video.findByIdAndUpdate(
            
                videoId,
                {
                    $set : updateFields 
                },
                {new:true}
            )
            if(!updatedVideo) throw new ApiError(400,"Couldn't find video")
            return res
                      .status(200)
                      .json(new ApiResponse(200,updatedVideo,"Video updated Successfully"))
    } catch (error) {
        throw new ApiError(400,`ERRRROR:::${error.message}`)
    }
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!videoId) throw new ApiError(400,"Incorrect videoId")
    const video = await Video.findByIdAndDelete(videoId)
    if(!video) throw new ApiError(400,"No Video found to delete")
    
    
    
    return res
              .status(200)
              .json(new ApiResponse(200,{},"Video deleteed successfully"))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!videoId) throw new ApiError(400,"Need video id to fetch the video")
    const video = await Video.findByIdAndUpdate(videoId,
        {
            $set : {
                isPublished : !isPublished
            }
        },
        {
            new : true
        }
    )
    return res
              .status(200)
              .json(new ApiResponse(200,video.isPublished,"Video's published status changed"))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideoDetails,
    deleteVideo,
    togglePublishStatus
}