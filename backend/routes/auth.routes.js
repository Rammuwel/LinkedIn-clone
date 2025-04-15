import express from 'express';
import { signUp } from '../controllers/auth.controller';


let authRouter = express.Router();
authRouter.post("/signup", signUp);