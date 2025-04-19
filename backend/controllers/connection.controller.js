import { connect } from "mongoose"
import Connection from "../models/connection.model.js"
import User from "../models/user.model.js"


export const sendConnection = async (req, res)=>{
    try {
        
        const {id} = req.params
        const sender = req.userId

        if(id === sender) {
         return res.status(400).json({success: false, message: "You con't send request to itself"})
        }

        const user = await User.findById(sender)

        if(user.connection.includes(id)){
         return res.status(400).json({success: false, message: "You are already connected"})
        }

        let existingConnection = await Connection.findOne({
            sender,
            receiver:id,
            status:"pending"
        });


        if(existingConnection){
         return res.status(400).json({success: false, message: "You are already send request"})
        }


        const newRequest = await Connection.create({
            sender,
            receiver:id
        })

        return res.status(200).json({success: true, newRequest})
  
    } catch (error) {
        return res.status(400).json({success: false, message: error.message})
        
    }
}



export const acceptConnection = async (req, res)=>{
    try {
        
    } catch (error) {
        return res.status(400).json({success: false, message: error.message})
        
    }
}