import dotenv from "dotenv"
dotenv.config({
    path : "../.env"
})
 // this is acceptable but this hinders the consistency of code  
// This should be loaded first thing as this .env will be 
import app from "./app.js";
import connectDB from "./db/index.js";
connectDB()
.then(()=> {
    app.listen(process.env.PORT || 8000 , ()=>{
        console.log(`Server listening at port:${process.env.PORT}`);
    }  )
})
.catch(error => {
    console.log(`errorrrrrr!!!!!${error}`);
} )
