import multer from "multer";
// Here we use Disk storage
//With the help of req we can get req.body and access a lot of stuff
//But to req.file doesnt exist .
//This is the reason we have to use multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {  
      cb(null, "./public/temp") // This second argument is the place where we want to locally store files in our server
    },
    filename: function (req, file, cb) {    // filename 2nd
      cb(null, file.originalname) // This callback would return the localfilepath that we will use in the cloudinaryfile in src/utils folder
      /* 
        There is also a option of changing names of files while storing it in the loacl server (read docs)
        The reason we do this is that if user sends a file named nodejs 5 times it would override the files 
        So to solve this we ourselves generate unique names for files
      */
    }
  })
  
  export const upload = multer({ storage })