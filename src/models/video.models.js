import mongoose,{Schema,model} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema = new Schema({
    videoFile : {
        type :String,
        required : true
    },
    thumbnail:{
        type:String,
        required : true
    },
    title:{
        type:String,
        required : true,
    },
    description:{
        type:String,
        required : true
    },
    duration :{
        type : Number , // Cloudinary url which gives us duration
        required : true
    },
    views :{
        type : Number,
        default :0
    },
    isPublished :{
        type : Boolean,
        default :true
    },
    owner :{
        type :Schema.Types.ObjectId,
        ref  : "User"
    }
},{timestamps:true});

/*
    Now we have to understand that we can write simple queries in mongoose very easily. But to use complex aggregate pipelines we use 
    mongoose aggregate paginate. To use this we have to write it in the form of plugins
*/
videoSchema.plugin(mongooseAggregatePaginate)
// Also with this we can simply make sure that not all the videos are sent together once the user is finished with some, some more are sent 

export const Video = model("Video",videoSchema);