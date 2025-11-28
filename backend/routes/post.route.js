import express from "express"
import { signIn, signOut, signUp } from "../controllers/auth.controller.js"
import { editProfile, getCurrentUser, getProfile, suggestedUsers } from "../controllers/user.controller.js"
import isAuth from "../middlewares/isAuth.js"
import { upload } from "../middlewares/multer.js"

// ⭐ DELETE COMMENT ko yahan import kiya ✔
import { comment, getAllPosts, like, saved, uploadPost, deletePost, deleteComment } from "../controllers/post.controller.js"

const postRouter = express.Router()

postRouter.post("/upload", isAuth, upload.single("media"), uploadPost)
postRouter.get("/getAll", isAuth, getAllPosts)
postRouter.get("/saved/:postId", isAuth, saved)
postRouter.get("/like/:postId", isAuth, like)
postRouter.post("/comment/:postId", isAuth, comment)
postRouter.delete("/delete/:postId", isAuth, deletePost)

// ⭐ NEW — Comment delete route ✔
postRouter.delete("/comment/:postId/:commentId", isAuth, deleteComment)

export default postRouter
