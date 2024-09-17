import { Router } from "express";
import { loginUser, registerUser,logOutUser,refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateUserAvatar, updateCoverImageAvatar, getUserChannelProfile, getWatchHistory } from "../controllers/user.controllers.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();
//go to notes
router.route("/register").post(
    upload.fields([   // Middleware
        {
            name : "avatar",
            maxCount: 1 
        },
        {
            name : "coverImage",
            maxCount : 1
        }
    ]),registerUser);
    router.route("/login").post(loginUser)

    // Secured Routes (require login)
    router.route("/logout").post(verifyJWT,logOutUser)
    router.route("/refresh-access-token").post(refreshAccessToken)
    router.route("/change-password").post(verifyJWT,changeCurrentPassword)
    router.route("/current-user").get(verifyJWT,getCurrentUser)
    router.route("/update-account").patch(verifyJWT,updateAccountDetails) // If not patch then every detail will be updated
    router.route("/avatar-update").patch(verifyJWT,upload.single("avatar"),updateUserAvatar)
    router.route("/cover-image-update").patch(verifyJWT,upload.single("coverImage"),updateCoverImageAvatar)
    router.route("/userChannel/:username").get(verifyJWT,getUserChannelProfile) // The username from this url is passed 
    router.route("/getWatchHistory").get(verifyJWT,getWatchHistory)
// Now we have upload middleware from multer and want to execute it as a middleware
// Before registerUser we can inject a middleware that we take avatar and coverimage from the user
// This way we can simply handle files as well 
//upload has a method called fields which accepts array 

export default router;