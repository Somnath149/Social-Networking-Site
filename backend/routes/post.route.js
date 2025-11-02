import express from "express"
import { signIn, signOut, signUp } from "../controllers/auth.controller.js"
import { editProfile, getCurrentUser, getProfile, suggestedUsers } from "../controllers/user.controller.js"
import isAuth from "../middlewares/isAuth.js"
import { upload } from "../middlewares/multer.js"
import { comment, getAllPosts, like, saved, uploadPost } from "../controllers/post.controller.js"

const postRouter =express.Router()

postRouter.post("/upload",isAuth,upload.single("media"),uploadPost)
postRouter.get("/getAll",isAuth,getAllPosts)
postRouter.get("/saved/:postId", isAuth, saved)
postRouter.get("/like/:postId",isAuth,like)
postRouter.post("/comment/:postId",isAuth,comment)

export default postRouter