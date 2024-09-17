import mongoose,{Schema,model} from "mongoose"
const subscriptionSchema = new Schema({
    subscriber :{                   // One who is subscribing  (User)
        type : Schema.Types.ObjectId, 
        ref : "User"
    },
    channel : {                     // One to whom subscriber is subscribing (Also a User)
        type : Schema.Types.ObjectId, 
        ref : "User"
    }
},{timestamps:true})
const Subscription = mongoose.model("Subscription",subscriptionSchema)