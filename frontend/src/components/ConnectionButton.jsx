import React, { useContext, useEffect, useState } from 'react'
import { authContext } from '../context/AuthContext.jsx'
import axios from 'axios'

import { socket, userDataContext } from '../context/UserContext.jsx'
import { useNavigate } from 'react-router-dom'



function ConnectionButton({ userId }) {
  const [status, setStatus] = useState("")
  const { serverUrl } = useContext(authContext)
  const { userData } = useContext(userDataContext)
  const navigate = useNavigate()
  const handleSendConnection = async () => {
    try {
      let { data } = await axios.post(`${serverUrl}/api/connection/send/${userId}`, {}, { withCredentials: true })
   
    } catch (error) {
      console.log(error.message)
    }
  }
  const handleGetStatus = async () => {
    try {
      let { data } = await axios.get(`${serverUrl}/api/connection/getstatus/${userId}`, { withCredentials: true })
      setStatus(data.status)

    } catch (error) {
      console.log(error.message)
    }
  }

  const handleRmoveConnection = async () => {
    try {
      let { data } = await axios.delete(`${serverUrl}/api/connection/remove/${userId}`, { withCredentials: true })
    } catch (error) {
      console.log(error.message)
    }
  }


  const handleClick = async () => {
    if (status == "disconnect") {
      await handleRmoveConnection()
    } else if (status == "received") {
      navigate("/network")
    } else {
      handleSendConnection()
    }
  }


  useEffect(() => {
    socket.emit("register", userData._id)
    handleGetStatus()


    const statusUpdateHandler = ({updatedUserId, newStatus}) => {
        setStatus(newStatus);
    };

    socket.on("statusUpdate", statusUpdateHandler);

    return () => {
      socket.off("statusUpdate", statusUpdateHandler);
    };
  }, [userId])

  return (
    <div>
      <button onClick={handleClick} disabled={status == "pending"} className='w-[100px] my-5 h-[40px] rounded-full  border-2 border-[#2dc0ff] p-0 m-0  text-[#2dc0ff]'>{status}</button>
    </div>
  )
}

export default ConnectionButton