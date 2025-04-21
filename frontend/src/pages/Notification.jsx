import React, { useContext, useEffect, useState } from 'react'
import Nav from '../components/Nav'
import { authContext } from '../context/AuthContext'
import axios from 'axios';
import { userDataContext } from '../context/UserContext';
import userlogo from "../assets/userlogo.png"
import { RxCross1 } from "react-icons/rx";


function Notification() {

    const { userData } = useContext(userDataContext)
    const { serverUrl } = useContext(authContext)
    const [notifications, setNotifications] = useState([]);


    const getNotification = async () => {
        try {
            const { data } = await axios.get(serverUrl + '/api/notification/getnotification', { withCredentials: true })
            setNotifications(data.notifications);
        } catch (error) {
            console.log(error.message)
        }

    }

    const handleDeleteNotification = async (id) => {
        try {
            const { data } = await axios.delete(serverUrl + `/api/notification/deleteone/${id}`, { withCredentials: true })
            getNotification();
        } catch (error) {
            console.log(error.message)
        }

    }
    const handleClearNotification = async () => {
        try {
            const { data } = await axios.delete(serverUrl + '/api/notification/deleteall', { withCredentials: true })
            getNotification();
        } catch (error) {
            console.log(error.message)
        }

    }

    useEffect(() => {
        getNotification();
    }, [userData])


    const handleStatus = (type) => {
        if (type == "like") {
            return "liked your post"
        } else if (type == "comment") {
            return "commented your post"
        } else {
            return "accepted your connection request"
        }
    }

    console.log(notifications)

    return (
        <div className='bg-[#eceaea] w-screen h-[100vh]'>
            <Nav />

            <div className='w-full p-3 flex flex-col gap-3'>
                <div className='w-full  px-5 h-[100px] bg-white shadow-lg text-gray-600 text-[22px] flex justify-between items-center rounded-lg'>
                   <div> Notifications {notifications.length}</div>
                   {notifications.length>0 && <button onClick={handleClearNotification} className='text-sm lg:text-[16px] text-blue-400 border rounded-full cursor-pointer border-blue-400 py-2 px-4'>Clear All</button>}
                </div>
                <div  className='w-full lg:w-[80%] m-auto p-2 bg-white shadow-lg text-gray-600  text-sm lg:text-[18px] md:text-[22px] rounded-lg'>
                    {
                        notifications.map((notification, index) => (
                            <div key={index} className='flex flex-col border-b-2 border-b-gray-100 p-2'>
                                <div className='flex items-center gap-2 relative'>
                                    <div className='cursor-pointer w-[50px] h-[50px]  lg:w-[60px] lg:h-[60px] rounded-full overflow-hidden -z-1'>
                                        <img src={notification.relatedUser.profileImage || userlogo} alt="" className='w-full' />
                                    </div>
                                    <div className='text-[12px] lg:text-[18px] font-semibold text-gray-700'>{`${notification.relatedUser.firstName} ${notification.relatedUser.lastName} ${handleStatus(notification.type)}`}</div>
                                    <RxCross1 onClick={()=>handleDeleteNotification(notification._id)} className=' cursor-pointer absolute right-6  font-bold text-2xl' />
                                </div>
                                {notification.relatedPost && <div className='flex items-center gap-2 pl-16'>
                                   { notification.relatedPost.image && <div className='cursor-pointer w-[40px] h-[40px] lg:w-[50px] lg:h-[50px] overflow-hidden -z-1'>
                                        <img src={notification.relatedPost.image} alt="" className='w-full' />
                                    </div>}
                                    <div className='text-sm lg:text-[16px] font-semibold text-gray-500'>{`${notification.relatedPost.description.slice(0, 20)}.... `}</div>
                                </div>}
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Notification