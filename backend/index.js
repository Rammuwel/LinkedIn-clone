import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRouter from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import userRouter from './routes/user.routes.js';
import postRouter from './routes/post.routers.js';
import connectionRouter from './routes/connection.routes.js';
dotenv.config()

const port = process.env.PORT || 5000

const app = express();

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.get('/', (req, res)=>{  
    res.send('root router of app');
});


app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/connection", connectionRouter);





app.listen(port, ()=>{
    connectDB()
    console.log(`server runing on PORT ${port}`)
})