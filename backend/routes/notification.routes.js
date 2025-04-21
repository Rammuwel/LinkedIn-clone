import express from 'express'
import { clearAllNotification, getNotification, removeNotification } from '../controllers/notification.controoller.js'
import isAuth from '../middleware/isAuth.js'



const notificationRouter =  express.Router()

notificationRouter.get('/getnotification',isAuth , getNotification)
notificationRouter.delete('/deleteone/:id', isAuth, removeNotification)
notificationRouter.delete('/deleteall', isAuth, clearAllNotification)

export default notificationRouter