import express from 'express';
import http from 'http'
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRouter from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import userRouter from './routes/user.routes.js';
import postRouter from './routes/post.routers.js';
import connectionRouter from './routes/connection.routes.js';
import { Server } from 'socket.io';
import { Socket } from 'dgram';
import notificationRouter from './routes/notification.routes.js';
dotenv.config()

const port = process.env.PORT || 5000

const app = express();
const server = http.createServer(app)

export const io = new Server(server,{
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }
})
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
app.use("/api/notification", notificationRouter);

 export const userSocketMap = new Map()

io.on("connection", (socket)=>{
    // console.log("user connected", socket.id)
    socket.on("register", (userId)=>{
        userSocketMap.set(userId, socket.id)
        // console.log(userSocketMap)
    })
    socket.on("disconnect", (socket)=>{
    //    console.log("disconnected", socket.id) 
    })    
})


server.listen(port, ()=>{
    connectDB()
    console.log(`server runing on PORT ${port}`)
})