import express from "express"
import isAuth from "../middlewares/isAuth.js"
import { upload } from "../middlewares/multer.js"
import { getAllLoops, uploadLoop, like, comment } from "../controllers/loop.controller.js"
import { getStoryByUserName, uploadStory, viewStory } from "../controllers/story.controller.js"

const storyRouter =express.Router()

storyRouter.post("/upload",isAuth,upload.single("media"),uploadStory)
storyRouter.get("/view/:storyId",isAuth,viewStory)
storyRouter.get("/getByUserName/:userName",isAuth,getStoryByUserName)

export default storyRouter