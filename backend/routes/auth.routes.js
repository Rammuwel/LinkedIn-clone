import express from 'express';
import { login, logiOut, signUp } from '../controllers/auth.controller.js';


let authRouter = express.Router();


authRouter.post("/signup", signUp);
authRouter.post("/signin", login);
authRouter.get("/signout", logiOut);

export default authRouter;