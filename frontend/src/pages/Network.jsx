import React, { useContext, useEffect, useState } from 'react'
import Nav from '../components/Nav'
import { authContext } from '../context/AuthContext'
import axios from 'axios';
import userlogo from "../assets/userlogo.png"



function Network() {

    const { serverUrl } = useContext(authContext);
    const [connections, setConnections] = useState([])

    const handleGetRequest = async () => {
        try {
            let { data } = await axios.get(serverUrl + "/api/connection/requests", { withCredentials: true })
            setConnections(data)
        } catch (error) {
            console.log(error.message)
        }
    }

    const handleAcceptConnection = async (requestId)=>{
        try {
            let {data} = await axios.put(`${serverUrl}/api/connection/accept/${requestId}`, {}, {withCredentials:true})
            setConnections(connections.filter((con)=>con._id != requestId))
        } catch (error) {
            console.log(error.message)
        }
    }


    const handleRejectConnection = async (requestId)=>{
        try {
            let {data} = await axios.put(`${serverUrl}/api/connection/reject/${requestId}`, {}, {withCredentials:true})
            setConnections(prev=>prev.filter((con)=>con._id != requestId))
        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(() => {
        handleGetRequest()
    })
    return (
        <>

            <div className='bg-[#eceaea] w-screen h-[100vh]'>
                <Nav />
                <div className='w-full p-3 flex flex-col gap-3'>
                    <div className='w-full p-2 h-[100px] bg-white shadow-lg text-gray-600 text-[22px] flex items-center rounded-lg'>
                        Invitation {connections.length}
                    </div>
                    <div className='w-full p-2 bg-white shadow-lg text-gray-600 text-[18px] md:text-[22px] rounded-lg'>
                        {
                            connections.map((connection, index) => (
                                <div className='flex items-center justify-between border-b-2 border-b-gray-100'>
                                    <div className='flex items-center gap-2'>
                                        <div  className='cursor-pointer  w-[60px] h-[60px] rounded-full overflow-hidden -z-1'>
                                            <img src={connection.sender.profileImage || userlogo} alt="" className='w-full' />
                                        </div>
                                        <div className='text-[18px] font-semibold text-gray-700'>{`${connection.sender.firstName} ${connection.sender.lastName}`}</div>
                                    </div>
                                    <div className='flex items-center gap-5'>
                                        <button onClick={()=>handleAcceptConnection(connection._id)} className='w-24 my-5 h-[40px] rounded-full  border-2 border-[#2dc0ff] flex items-center justify-center gap-2 text-[#2dc0ff]'>Accept</button>
                                        <button onClick={()=>handleRejectConnection(connection._id)} className='w-24 my-5 h-[40px] rounded-full  border-2 border-[rgb(209,127,127)] flex items-center justify-center gap-2 text-[rgb(209,127,127)]'>Reject</button>
                                    </div>
                                   
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default Network