import express from 'express';
import isAuth from '../middleware/isAuth.js';
import { sendConnection } from '../controllers/connection.controller.js';


const connectionRouter = express.Router()

connectionRouter.get("/send/:id", isAuth, sendConnection)



export default  connectionRouter;