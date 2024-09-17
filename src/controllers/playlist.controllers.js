import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.models.js"

const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    if(!name) throw new ApiError(400,"Name is required to create a playlist")
    
    const newPlaylist = await Playlist.create({name,description})
    if(!newPlaylist) throw new ApiError(500,"Error while creating a new playlist")
    return res
            .status(201)
            .json(new ApiResponse(200,newPlaylist,"Created new playlist successfully"))
    //TODO: create playlist
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    if(!userId) throw new ApiError(400,"Couln't find User ID")
    const userPlaylists = await Playlist.find({owner : userId})

    if(!userPlaylists)
    {
        return res 
                .status(200)
                .json(new ApiResponse(200,[],"User doesn't have any playlists"))
    }
    else
    {
        return res
                .status(200)
                .json(new ApiResponse(200,userPlaylists,"User Playlist fetched successfully"))
    }
    //TODO: get user playlists
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    if(!playlistId) throw new ApiError(400,"Couln't retrive PlaylistId from the url")
    const playlist = await Playlist.findById(playlistId)
    if(!playlist) throw new ApiError(400,"Invalid playlist Id")
    return res
            .status(200)
            .json(new ApiResponse(200,playlist,"Playlist fetched successfully"))
})


const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    if(!playlistId) throw new ApiError(400,"Couldnt fetch playlistId")
    if(!videoId) throw new ApiError(400,"Couldn't fetch videoId")
    
    const playlist = await Playlist.findById(playlistId)
    if(!playlist) throw new ApiError(400,"Playlist not found")
    const videoExists = await playlist.videos.includes(videoId)
    if(videoExists) throw new ApiError(400,"Video already exists in the playlist")
    await playlist.videos.push(videoId)
    return res
            .status(200)
            .json(new ApiResponse(200,videoId,"Video Successfully Added to playlist"))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    /*
        The splice method in JavaScript is used to add or remove elements from an array. The syntax for splice is:
        array.splice(start, deleteCount, item1, item2, ...);
        start: The index at which to start changing the array.
        deleteCount: The number of elements to remove.
        item1, item2, ...: Elements to add to the array (optional).
    */
        if(!playlistId) throw new ApiError(400,"Couldnt fetch playlistId")
        if(!videoId) throw new ApiError(400,"Couldn't fetch videoId")
        const playlist = await Playlist.findById(playlistId)
        if(!playlist) throw new ApiError(400,"Playlist not found")
        const videoIndex = playlist.videos.indexOf(videoId);
        if(videoIndex == -1 ) throw new ApiError(400,"Video Doesn't exist in the playlist") // Dont use !videoIndex
         await playlist.videos.splice(videoIndex,1)
         await playlist.save()
         return res
                 .status(200)
                 .json(new ApiResponse(200,playlist,"Removed video successfully from the playlist"))
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    if(!playlistId) throw new ApiError(400,"Coulnt fetch playlistId")
    await Playlist.findByIdAndDelete(playlistId)
    return res  
            .status(200)
            .json(new ApiResponse(200,{},"Playlist deleted successfully"))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    if(!playlistId) throw new ApiError(400,"Coulnt fetch playlistId")
    if(!name) throw new ApiError(400,"Coulnt fetch name")
    const updatedFields = {}
    if(name!=undefined) updatedFields.name = name
    if(description!=undefined) updatedFields.description = description
    try {
        const updatedPlaylist = await findByIdAndUpdate(
            playlistId,
            {
                $set : updatedFields
            },
            {
                new : true
            })
            return res
                    .status(200)
                    .json(200,updatePlaylist,"Playlist updated Successfully")
    } catch (error) {
        throw new ApiError(400,`Errrrrrrr:${errror.message}`)
    }  
    //TODO: update playlist
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}