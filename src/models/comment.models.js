import mongoose,{Schema,model} from "mongoose";
const commentSchema = new Schema(
    {
        content : {
            type : String,
            required : true
        },
        video : {
            type : Schema.Types.ObjectId,
            ref : "Video"
        },
        owner : {
            type : Schema.Types.ObjectId,
            ref : "User"
        }
    },
    {
        timestamps : true
    }
)
export const Comment = new model("Comment",commentSchema)