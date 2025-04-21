import Notification from "../models/notification.model.js"


export const getNotification = async (req, res)=>{
    try {
        

        let notifications = await Notification.find({receiver:req.userId})
        .populate("relatedUser", "firstName lastName profileImage")
        .populate("relatedPost", "image description")
        return res.json({success:true, notifications})
    } catch (error) {
        return res.json({success: false, message: error.message})  
        
    }
}


export const removeNotification = async (req, res)=>{
  try {
    
    let {id} = req.params
     let notification = await Notification.findByIdAndDelete(id)
     return res.status(200).json({success:true, message:"Notification deleted"})
  } catch (error) {
    return res.json({success: false, message: error.message})  
    
  }
}


export const clearAllNotification = async (req, res)=>{
    try {
       let notification = await Notification.deleteMany({
        receiver: req.userId
       })
       return res.status(200).json({success:true, message:"Cleared All Notification "})
    } catch (error) {
      return res.json({success: false, message: error.message})  
      
    }
  }