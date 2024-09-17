import mongoose,{Schema,model} from "mongoose";

const likeSchema = new Schema (
    {
            video : {
                type : Schema.Types.ObjectId,
                ref : "Video"

            },
            comment : {
                type : Schema.Types.ObjectId,
                ref : "Comment"
            },
            tweet : {
                type : Schema.Types.ObjectId,
                ref : "Tweet"
            },
            likedBy : {
                type : Schema.Types.ObjectId,
                ref : "User",
                required : true
            }
    },
    {timestamps : true}
)
// This is to make sure that only one of these three fields should only be filled at any point and not more than one should be there
likeSchema.pre('save', function(next) {
    if (!this.video && !this.comment && !this.tweet) {
        next(new Error('A like must reference a video, comment, or tweet.'));
    } else if ((this.video && this.comment) || (this.video && this.tweet) || (this.comment && this.tweet)) {
        next(new Error('A like can only reference one entity: either a video, comment, or tweet.'));
    } else {
        next();
    }
});
export const Like = new model("Like",likeSchema)