/*
What is cloudinary?

BAsically it is a cloud service(sdk) that is used that we will use to store images pdf etc
TO do that :-
--Generally what we do is first we use a npm package called multer that takes files and stores it in our local Storage(multer will be used as a middleware)
this is done if user exits the process or if we want to reupload it for some reason
--Next we use cloudinary that will take data from our local storage and then store it in cloud(cloudinary servers)
*/
/*
--In this file we will write the code that the  file has reached our local server and we are directiing it to the cloud using cloudinary
--Once successfully uploaded we remove it from our server 



####################################################   DELETE   #############################################################################
Also in the fs (already a native library in node) files are linked and unliked
So to delete a file we simply unlink it

*/
import {v2 as cloudinary } from "cloudinary"
import fs from "fs"
// This config is the one that gives us permission to upload file with our account
cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY , 
        api_secret: process.env.CLOUDINARY_API_SECRET
})

export const uploadOnCloudinary = async (localfilepath)=>{
    try {
        if(!localfilepath)return null; // if nullfilepath
        // To upload file on cloudinary

        const response =  await cloudinary.uploader.upload(localfilepath,{resource_type: "auto"})
        // File uploaded successfully
        console.log(`File uploaded on cloudinary${response.url}`);
        fs.unlinkSync(localfilepath) // This will 
        return response; // You can also simply return the public url that u will use to get the data from cloudinary
    } catch (error) {
        // If file not uploaded to server unlink it synchronously
        fs.unlinkSync(localfilepath);
    }
}
