import express from "express";
import { getCurrentUser,getUser, updateProfile } from "../controllers/user.controllers.js";
import isAuth from "../middleware/isAuth.js";
import upload from "../middleware/multer.js";

let userRouter = express.Router()


userRouter.get('/getuser/:id', isAuth, getUser);
userRouter.get('/currentuser', isAuth, getCurrentUser);
userRouter.put('/updateprofile', isAuth, upload.fields([
  {name: "profileImage", maxCount:1},
  {name: "coverImage", maxCount:1}
]), updateProfile);


export default userRouter;