import { connect } from "mongoose"
import Connection from "../models/connection.model.js"
import User from "../models/user.model.js"
import { io, userSocketMap } from '../index.js'
import Notification from "../models/notification.model.js"

export const sendConnection = async (req, res) => {
    try {

        const { id } = req.params
        const sender = req.userId

        if (id === sender) {
            return res.status(400).json({ success: false, message: "You con't send request to itself" })
        }

        const user = await User.findById(sender)

        if (user.connection.includes(id)) {
            return res.status(400).json({ success: false, message: "You are already connected" })
        }

        let existingConnection = await Connection.findOne({
            sender,
            receiver: id,
            status: "pending"
        });


        if (existingConnection) {
            return res.status(400).json({ success: false, message: "You are already send request" })
        }


        const newRequest = await Connection.create({
            sender,
            receiver: id
        })


        let recieverSocketId = userSocketMap.get(id)
        let senderSocketId = userSocketMap.get(sender)



        if (recieverSocketId) {
            io.to(recieverSocketId).emit("statusUpdate", { updatedUserId: sender, newStatus: "received" })
        }
        if (senderSocketId) {
            io.to(senderSocketId).emit("statusUpdate", { updatedUserId: id, newStatus: "pending" })
        }

        return res.status(200).json({ success: true, newRequest })

    } catch (error) {
        return res.status(400).json({ success: false, message: error.message })

    }
}



export const acceptConnection = async (req, res) => {
    try {
        const { connectionId } = req.params

        const connection = await Connection.findById(connectionId)

        if (!connection) {
            return res.status(400).json({ success: false, message: "connection does not exist" })
        }

        if (connection.status !== "pending") {
            return res.status(400).json({ success: false, message: "connection is under process" })
        }

        connection.status = "accepted"
        let notification = await Notification.create({
            receiver: connection.sender,
            type: "connectionAccept",
            relatedUser: req.userId,
          
        })
        connection.save()

      

        await User.findByIdAndUpdate(req.userId, {
            $addToSet: { connection: connection.sender._id }
        })

        await User.findByIdAndUpdate(connection.sender._id, {
            $addToSet: { connection: req.userId }
        })

        let recieverSocketId = userSocketMap.get(connection.receiver._id)
        let senderSocketId = userSocketMap.get(connection.sender._id)

        if (recieverSocketId) {
            io.to(recieverSocketId).emit("statusUpdate", { updatedUserId: connection.sender._id, newStatus: "disconnect" })
        }
        if (senderSocketId) {
            io.to(senderSocketId).emit("statusUpdate", { updatedUserId: connection.receiver._id, newStatus: "disconnect" })
        }


        return res.status(200).json({ success: true, message: "connection accepted" })

    } catch (error) {
        return res.status(400).json({ success: false, message: error.message })
    }
}


export const rejectConnection = async (req, res) => {
    try {
        const { connectionId } = req.params

        const connection = await Connection.findById(connectionId)

        if (!connection) {
            return res.status(400).json({ success: false, message: "connection does not exist" })
        }

        if (connection.status !== "pending") {
            return res.status(400).json({ success: false, message: "connection is under process" })
        }

        connection.status = "rejected"
        connection.save()

        let recieverSocketId = userSocketMap.get(connection.receiver._id)
        let senderSocketId = userSocketMap.get(connection.sender._id)

        if (recieverSocketId) {
            io.to(recieverSocketId).emit("statusUpdate", { updatedUserId: connection.sender._id, newStatus: "connect" })
        }
        if (senderSocketId) {
            io.to(senderSocketId).emit("statusUpdate", { updatedUserId: connection.receiver._id, newStatus: "connect" })
        }

        return res.status(200).json({ success: true, message: "connection rejected" })

    } catch (error) {
        return res.status(400).json({ success: false, message: error.message })
    }
}


export const getConnectionStatus = async (req, res) => {
    try {
        const targetUserId = req.params.userId
        const currectUserId = req.userId

        let currectUser = await User.findById(currectUserId)

        if (currectUser.connection.includes(targetUserId)) {
            return res.json({ status: "disconnect" })
        }

        const pendingRequest = await Connection.findOne({
            $or: [
                { sender: currectUser, receiver: targetUserId },
                { sender: targetUserId, receiver: currectUser }
            ],
            status: "pending"
        })
        if (pendingRequest) {

            if (pendingRequest.sender.toString() === currectUserId.toString()) {
                return res.json({ status: "pending" })
            } else {
                return res.json({ status: "received", requestId: pendingRequest._id });
            }

        }

        return res.json({ status: "connect" })
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message })
    }
}




export const removeConnection = async (req, res) => {
    try {
        const userId = req.userId
        const otherUserId = req.params.userId

        await User.findByIdAndUpdate(userId, {
            $pull: { connection: otherUserId }
        })
        await User.findByIdAndUpdate(otherUserId, {
            $pull: { connection: userId }
        })

        let recieverSocketId = userSocketMap.get(userId)
        let senderSocketId = userSocketMap.get(otherUserId)

        if (recieverSocketId) {
            io.to(recieverSocketId).emit("statusUpdate", { updatedUserId: otherUserId, newStatus: "connect" })
        }
        if (senderSocketId) {
            io.to(senderSocketId).emit("statusUpdate", { updatedUserId: userId, newStatus: "connect" })
        }

        return res.json({ message: "Connection remove successfully" })
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message })

    }
}


export const getConnectionRequests = async (req, res) => {
    try {
        const userId = req.userId

        const requests = await Connection.find({ receiver: userId, status: "pending" }).populate("sender", "firstName lastName email userName profileImage headline");

        return res.status(200).json(requests)
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message })

    }
}


export const getUserConnections = async (req, res) => {
    try {
        const userId = req.userId

        const user = await User.findById(userId).populate("connection", "firstName lastName userName profileImage, headline connection")
        return res.status(200).json(user.collection)

    } catch (error) {
        return res.status(400).json({ success: false, message: error.message })

    }
}