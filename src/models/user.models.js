import {Schema,model} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
const userSchema = new Schema({

    username : {
        type: String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
        index : true // TO make any field searchable make it as a index as it would obtimize searching
    } ,
     email : {
        type: String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
    },
    fullname : {
        type: String,
        required : true,
        trim : true,
        index :true
    },
    avatar:{
        type : String, // cloudinary url(Store images in a 3rd party service and then use its url )
        required :true
    },
    coverImage:{
        type : String, // cloudinary url(Store images in a 3rd party service and then use its url )
    },
    watchHistory: [
        {
            type : Schema.Types.ObjectId,
            ref  : "Video" 
        }
    ],
    password :{
        type : String,
        req : [true,"Password is required"]
    },
    refreshToken:{
        type : String
    }
},{timestamps:true});
/*
    Now we need to encrypt passwords for security reasons for that we will use bcryptjs 
    Now before the user saves their password we have to encrypt it before storing it 
    For that mongoose provides predefined hooks(hooks are also middlewares) 
    example pre,post
*/
userSchema.pre("save", async function (next){
    if(!this.isModified("password"))    return next(); //This is to make sure that password is modified.
    // If this check is not done then what happens is that this hook will be called everytime any detail is saved 
    this.password = await bcrypt.hash(this.password,10) // This 10 indicates the number of rounds to encrypt. Read Docs
    next();
}) // similar to write as app.listen 

userSchema.methods.isPasswordCorrect = async function (password){ // This is how we make custom methods for userSchema
    return await bcrypt.compare(password,this.password) // This bcrypt's compare method asks for password entered and the encrypted password
                                                       // we have stored in db 
}
// JWT is a bearer token . Whosoever has this token can get the requested data
userSchema.methods.generateAccessToken = function(){ // Make sure this isnt a arrow function as it doesnt have ref to "this"
    return jwt.sign(
        {
            _id: this._id,              // Payload will be used during logout
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}// The way we write this is by passing payload object(data),Accesstoken string and expiresIn as object
    userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
            _id : this._id,   // This is a payload(data) 
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )}
export const User = model("User",userSchema);
