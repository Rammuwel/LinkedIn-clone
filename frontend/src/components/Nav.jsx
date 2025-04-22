import React, { useContext, useEffect } from 'react'
import navlogo from '../assets/navlogo.png'
import { IoSearchSharp } from "react-icons/io5";
import { IoMdHome } from "react-icons/io";
import { FaUsers } from "react-icons/fa6";
import { IoIosNotifications } from "react-icons/io";
import userlogo from '../assets/userlogo.png'
import { useState } from 'react';
import { userDataContext } from '../context/UserContext.jsx';
import { authContext } from '../context/AuthContext.jsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Nav() {
    let [activeSearch, setActiveSearch] = useState(false)
    let [showPopup, setShowPopup] = useState(false)
    let { userData, setUserData } = useContext(userDataContext)

    let { serverUrl } = useContext(authContext);
    const [query, setQuery] = useState('');
    const [querySearchData, setQuerySearchData] = useState([]);



    const navigate = useNavigate()
    const handleLogout = async () => {
        try {
            let { data } = await axios.get(serverUrl + '/api/auth/signout', { withCredentials: true })
            if (data.success) {
                console.log(data.message)
                setUserData(null)
                navigate('/login');
            }
        } catch (error) {
            console.log(error.message)
        }
    }



    const handleSearchRequest = async () => {
        try {
            let { data } = await axios.get(serverUrl + `/api/user/search?query=${query}`, { withCredentials: true })

            if (data.success) {
                setQuerySearchData(data.users)
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(() => {
        if (query) {
            handleSearchRequest()
        }else{
            setQuerySearchData([])
        }
    }, [query])




    return (
        <div className='w-full h-[80px] px-5 flex items-center justify-between md:justify-around bg-white sticky top-0 shadow-lg z-50'>
            {/* Left nav content */}
            <div className='flex items-center gap-5 justify-start'>
                <div onClick={() => navigate('/')} className='w-[50px] cursor-pointer'>
                    <img src={navlogo} alt="" className='w-full' />
                </div>
                {!activeSearch && <div onClick={() => setActiveSearch(pre => !pre)} className=' cursor-pointer'><IoSearchSharp className='w-[23px] h-[23px] text-gray-700 lg:hidden' /></div>}
                <form className={`${!activeSearch ? "hidden" : 'flex'} w-[200px] sm:w-[350px] rounded-md h-[40px] bg-[#eceaea] lg:flex items-center gap-2 px-[10px] py-[5px]`}>
                    <div onClick={() => setActiveSearch(pre => !pre)}  className=' cursor-pointer'><IoSearchSharp className='w-[23px] h-[23px] text-gray-700' /></div>
                    <input value={query} onChange={(e) => setQuery(e.target.value)} type="text" className='w-[80%] outline-none h-full bg-transparent' />
                </form>
            </div>
            {  query &&
                <div className='absolute max-h-[500px]  overflow-auto  flex flex-col gap-3 p-2 top-[90px] left-0 lg:left-36 shadow-lg w-[100%] lg:w-[700px] bg-white'>
                    {
                        querySearchData.map((item, index) => (
                            <div onClick={()=>{
                                setQuery('')
                                setQuerySearchData([])
                                navigate(`/profile/${item._id}`)
                            }} key={index} className='border-b-2 cursor-pointer border-b-gray-200 p-2  flex items-center gap-3'>
                                <div className='w-[60px] h-[60px] rounded-full overflow-hidden'>
                                    <img src={item.profileImage || userlogo} alt="" className='w-full' />
                                </div>
                                <div className='text-[18px] font-semibold text-gray-700'>
                                    {`${item.firstName} ${item.lastName}`}
                                </div>
                            </div>
                        ))
                    }
                </div>
            }

            {/* right nav content */}
            <div className='flex justify-end items-center gap-5'>
                <div  onClick={() => navigate('/')} className='hidden cursor-pointer lg:flex flex-col items-center justify-center text-gray-600'>
                    <IoMdHome className='w-[23px] h-[23px]' />
                    <div>Home</div>
                </div>
                <div className=' hidden lg:flex flex-col items-center justify-center text-gray-600'>
                    <FaUsers className='w-[23px] h-[23px]' />
                    <div className=' cursor-pointer ' onClick={() => navigate('/network')}>My Network</div>
                </div>
                <div onClick={()=>navigate('/notification')} className='flex  cursor-pointer flex-col items-center justify-center text-gray-600'>
                    <IoIosNotifications className='w-[23px] h-[23px]' />
                    <div  className=' hidden md:flex'>Notification</div>
                </div>
                <div onClick={() => setShowPopup(pre => !pre)} className='w-[50px] h-[50px] rounded-full overflow-hidden'>
                    <img src={userData.profileImage || userlogo} alt="" className='w-full' />
                </div>

                {/* mobile profile model */}
                {showPopup && <div className='w-[300px] min-h-[300px] bg-white shadow-lg absolute top-[85px] rounded-lg flex items-center flex-col p-5 gap-5'>
                    <div className='w-[60px] h-[60px] rounded-full overflow-hidden'>
                        <img src={userData.profileImage || userlogo} alt="" className='w-full' />
                    </div>
                    <div className='text-[18px] font-semibold text-gray-700'>
                        {`${userData.firstName} ${userData.lastName}`}
                    </div>
                    <button className='w-full h-[40px] rounded-full  border-2 border-[#2dc0ff]  text-[#2dc0ff]' onClick={() => navigate(`/profile/${userData._id}`)}>View Profile</button>
                    <div className='w-full h-[1px] bg-gray-500'></div>
                    <div className='w-full  flex items-center justify-start gap-2 text-gray-600'>
                        <FaUsers className='w-[23px] h-[23px]' />
                        <div className=' cursor-pointer ' onClick={() => navigate('/network')}>My Network</div>
                    </div>
                    <button onClick={handleLogout} className='w-full h-[40px] rounded-full  border-2 border-[#d47b7b]  text-[#d47b7b]'>Logout</button>
                </div>}
            </div>
        </div>
    )
}

export default Nav