import mongoose from "mongoose";
import { DB_NAME } from "../constants";
const connectDB = async ()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log(`Mongo Connected ${connectionInstance.connection.host}`); // This is to make sure that we are connected to the correct database
        // As for testing production database is different  so make sure u are connected at the right place
    } catch (error) {
        console.log(`MongoDB Connection error ${error}`);
        process.exit(1);
    }
}
export default connectDB;