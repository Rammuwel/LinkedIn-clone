import React, { useContext, useEffect, useState } from 'react'
import userlogo from "../assets/userlogo.png"
import { BiLike } from "react-icons/bi";
import { IoSend } from "react-icons/io5";
import { FaRegComment } from "react-icons/fa6";
import moment from 'moment'
import { authContext } from '../context/AuthContext';
import axios from 'axios';
import { userDataContext } from '../context/UserContext';
import {io} from 'socket.io-client'
import ConnectionButton from './ConnectionButton';

let socket = io("http://localhost:8000")
function Post({ id, author, like, comment, description, image, createdAt }) {
  const [more, setMore] = useState(false)
  const { serverUrl } = useContext(authContext)
  const { userData, fetchPosts, postData, setUserData, setPostData } = useContext(userDataContext)
  const [likes, setLikes] = useState(like || [])
  const [comments, setComments] = useState(comment || [])
  const [commentContent, setCommentContent] = useState("")
  const [showCommentBox, setShowCommentBox] = useState(false)
  const [showCommentsBox, setShowCommentsBox] = useState(false)
  console.log(comments)
  const addLike = async () => {

    try {

      let { data } = await axios.get(serverUrl + `/api/post/like/${id}`, { withCredentials: true });
      setLikes(data.like)
    } catch (error) {
      console.log(error.message)
    }
  }
  const addComment = async (e) => {
    e.preventDefault()

    try {

      let { data } = await axios.post(serverUrl + `/api/post/comment/${id}`, { "content": commentContent }, { withCredentials: true });
      setComments(data.comment)
    } catch (error) {
      console.log(error.message)
    }
  }

  useEffect(()=>{
   socket.on("likeUpdated",({postId, likes})=>{
     if(postId == id){
      setLikes(likes)
     }
   })
   socket.on("commentUpdated",({postId, comment})=>{
     if(postId == id){
      setComments(comment)
     }
   })

   return  ()=>{
    socket.off("likeUpdated")
    socket.off("commentUpdated")
   }
  }, [])

  useEffect(() => {
    fetchPosts()
  }, [likes])


  return (
    <div className='w-full  flex flex-col gap-3  p-5 bg-white shadow-lg rounded-lg '>
      <div>
        <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className=' cursor-pointer  w-[60px] h-[60px] rounded-full overflow-hidden -z-1'>
            <img src={author.profileImage || userlogo} alt="" className='w-full' />
          </div>
          <div>
            <div className='text-[18px] font-semibold text-gray-700'>{`${author.firstName} ${author.lastName}`}</div>
            <div className='text-gray-500'>{author.headline}</div>
            <div className='text-gray-500'>{moment(createdAt).fromNow()}</div>
          </div>
         
        </div>
           { userData._id !== author._id &&
            <ConnectionButton userId={author._id}/>}
        </div>
        <div className={`text-gray-700 w-full ${!more ? "max-h-[100px] overflow-hidden" : ""}`}>
          {description}
          <div onClick={() => setMore(prev => !prev)} className='text-blue-600 cursor-pointer inline-block'>{more ? "...read less" : "...read more"}</div>
        </div>
        {image && <div className='w-full max-h-[300px] overflow-hidden flex justify-center'>
          <img src={image} alt="" />
        </div>}
      </div>
      <div className='flex flex-col gap-2 w-full'>
        
        <div className='flex justify-between items-center w-full'>
          <div className='flex items-center gap-1 text-blue-700'><BiLike /><span>{likes.length}</span></div>
          <div className='flex items-center gap-1 cursor-pointer' onClick={() => setShowCommentsBox(prev => !prev)} ><span>{comments.length} comment</span></div>
        </div>
        <div className='w-full bg-gray-500 h-[2px]'></div>
        <div className='flex items-center gap-5 pb-3'>
          <div className={`flex items-center text-lg cursor-pointer gap-1 ${likes.includes(userData._id) ? "text-blue-700" : ""}`} onClick={addLike}><BiLike /><span>like</span></div>
          <div onClick={() => setShowCommentBox(prev => !prev)} className='flex cursor-pointer items-center text-lg gap-1'><FaRegComment /><span>comment</span></div>
        </div>
        {showCommentBox && <div className='w-full'>
          <form onSubmit={addComment} className='w-full py-2  border-b-gray-500 border-b-2'>
            <input type="text" value={commentContent} onChange={(e) => setCommentContent(e.target.value)} placeholder='leave acomment' className='outline-none border-none text-gray-500 w-[90%]' />
            <button type='submit'><IoSend /></button>
          </form>

        </div>}
       {showCommentsBox && <div className='flex flex-col gap-2'>
          {
            comments.map((comm) => (
              <div key={comm._id} className='flex flex-col border-b-2 py-2 border-b-gray-300 gap-3'>
                <div className='w-full flex items-center justify-between '>
                  <div className=' flex gap-3 items-center justify-start'>
                    <div className=' cursor-pointer  w-[30px] h-[30px] rounded-full overflow-hidden -z-1'>
                      <img src={comm.user.profileImage || userlogo} alt="" className='w-full' />
                    </div>
                    <div className='text-[16px] font-semibold text-gray-700'>{`${comm.user.firstName} ${comm.user.lastName}`}</div>
                  </div>
                  <div className='text-gray-500 '>{moment(comm.createdAt).fromNow()}</div>

                </div>
                <div>
                  <div className='text-gray-700'>{comm.content}</div>
                </div>
              </div>
            ))
          }
        </div>}

      </div>
    </div>
  )
}

export default Post