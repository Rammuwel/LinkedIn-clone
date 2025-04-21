import React, { useContext, useEffect, useState } from 'react'
import Nav from '../components/Nav'

import userlogo from "../assets/userlogo.png"
import { FiPlus } from "react-icons/fi";
import { CiCamera } from "react-icons/ci";
import { FaPencilAlt } from "react-icons/fa";
import { userDataContext } from '../context/UserContext.jsx';

import EditProfile from '../components/EditProfile.jsx';
import Post from '../components/Post.jsx';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { authContext } from '../context/AuthContext.jsx';
import ConnectionButton from '../components/ConnectionButton.jsx';


function Profile() {

   
    const [showEdit, setShowEdit] = useState(false)
    const { userData, setUserData, postData, setPostData } = useContext(userDataContext)
    const {serverUrl} = useContext(authContext)
    const [user, setUser] = useState(null)
    const [id, setId] = useState(useParams().id)
    console.log(id)
    const [currentUserPost, setCurrentUserPost] = useState([]);


    const fetchUser = async ()=>{
        try {
            const {data} = await axios.get(`${serverUrl}/api/user/getuser/${id}`, {withCredentials:true})
            if(data.success){
               setUser(data.user)
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(()=>{
        if (user && postData.length > 0) {
            setCurrentUserPost(postData.filter(post => post.author._id === user._id));
        }
    }, [user, postData])
    

    useEffect( ()=>{
         fetchUser();  
    },[])


    return (
        <div className='w-full min-h-[100vh] bg-[#eceaea] flex flex-col items-center '>
            <Nav />
            <div className='w-full max-w-[900px] min-h-[100vh] p-3 flex flex-col gap-2'>
                <div className='w-full bg-white p-3 shadow-lg rounded-lg relative flex flex-col gap-1'>
                    <div onClick={() => setShowEdit(prev => !prev)} className=' overflow-hidden relative cursor-pointer w-full h-[200px]  bg-gray-400 rounded-lg'>
                        <img src={ user?.coverImage || null} alt="" />
                        <CiCamera className=' absolute right-2 top-2 text-xl font-semibold cursor-pointer text-white' />
                    </div>
                    <div onClick={() => setShowEdit(prev => !prev)} className=' absolute cursor-pointer top-[170px] left-[36px] w-[60px] h-[60px] rounded-full overflow-hidden -z-1'>
                        <img src={user?.profileImage || userlogo} alt="" className='w-full' />
                    </div>
                    <div className='cursor-pointer relative left-[60px] bottom-[6px] w-[20px] h-[20px] text-white rounded-full bg-blue-400  flex items-center'>
                        <FiPlus className='font-bold ' />
                    </div>
                    <div className='mt-[30px] pl-5 flex items-center justify-between pr-3'>
                       <div className=''>
                       <div className='text-[18px] font-semibold text-gray-700'>{`${user?.firstName} ${user?.lastName}`} <span className='font-semibold text-gray-700 text-sm'>{`( ${user?.userName} )`}</span></div>
                        <div className='text-[16px] text-gray-500'>{user?.headline || ""}</div>
                        <div className='text-[16px] text-gray-500'>{user?.location}</div>
                        <div className='text-[16px] text-gray-500'>{user?.connection ? user?.connection.length : 0} connection</div>
                       </div>
                        {
                      userData._id === user?._id?
                    <button onClick={() => setShowEdit(true)} className='w-[100px] my-5 h-[40px] rounded-full  border-2 border-[#2dc0ff] flex items-center justify-center gap-2 text-[#2dc0ff]'>Edit Profile <FaPencilAlt /></button>
                   : <ConnectionButton userId={user?._id}/>
                 
                     }

                    </div>
                
                </div>

                <div className='w-full bg-white p-3 shadow-lg rounded-lg relative'>
                    <div>
                        <h1>Post({currentUserPost.length})</h1>
                    </div>
                </div>
                <div className='flex flex-col gap-3 '>
                    {
                        currentUserPost.map((post, index) => (
                            <Post key={index} id={post._id} author={post.author} description={post.description} image={post.image} like={post.like} comment={post.comment} createdAt={post.createdAt} />
                        ))
                    }
                </div>
            </div>
            {showEdit && <EditProfile setEdit={setShowEdit} setUserData={setUserData} userData={userData} />}
        </div>
    )
}

export default Profile