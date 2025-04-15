import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
dotenv.config()

const port = process.env.PORT || 5000

const app = express();


app.get('/', (req, res)=>{
   
    res.send('root router of app');
})




app.listen(port, ()=>{
    connectDB()
    console.log(`server runing on PORT ${port}`)
})