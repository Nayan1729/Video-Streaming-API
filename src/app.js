import express from "express"
import cookieParser from "cookie-parser";
import cors from "cors"
const app = new express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true 
}))
app.use(express.json({limit:"16kb"})); // This means we are configuring and accepting json as data in our server and adding a limit of 16kb.
app.use(express.urlencoded({extended:true,limit:"16kb"})); // Sometimes when u write something in the google tab in search when it is
// converted into url and that url has some encoding like the space has %20 and other encoding . Here extended means we can use objects in 
// objects
app.use(express.static("public"));
app.use(cookieParser()); // The use of this cookie parser is that we can access the cookies of the user stored in their browser from our 
// server basically perform curd operation on the cookies in the browser from our server

//Route import

// User route import 
    import UserRouter from "./routes/user.routes.js";
    
    app.use("/api/v1/users",UserRouter) // Good practice to write /api/v1/users or v2 to show this is an api and our first version

export default app;