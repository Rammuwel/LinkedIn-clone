import React, { useContext, useRef, useState } from 'react'
import Nav from '../components/Nav'
import userlogo from "../assets/userlogo.png"
import { FiPlus } from "react-icons/fi";
import { RxCross1 } from "react-icons/rx";
import { FaImage } from "react-icons/fa";
import { CiCamera } from "react-icons/ci";
import { FaPencilAlt } from "react-icons/fa";
import { userDataContext } from '../context/UserContext.jsx';
import EditProfile from '../components/EditProfile';
import axios from 'axios';
import { authContext } from '../context/AuthContext';
import Post from '../components/Post';

function Home() {
  const {serverUrl} = useContext(authContext);
  const { userData, postData, setPostData, setUserData, edit, setEdit } = useContext(userDataContext)
  const [fImage, setFImage] = useState("")
  const [bImage, setBImage] = useState("")
  const [description, setDescription] = useState("")
  const [uploadPost, setUploadPost] = useState(false)
  const [postLoadin, setPostLoading] = useState(false)

  const image = useRef()


  const handleImage = (e) => {
    let file = e.target.files[0]
    setBImage(file)
    setFImage(URL.createObjectURL(file))
  }

  const handleUploadPost = async ()=>{
    try {
      setPostLoading(true)
       let formData = new FormData();
       formData.append("description", description)
       if(bImage){
        formData.append("image", bImage);
       }

       let {data} = await axios.post(serverUrl + "/api/post/create", formData, {withCredentials: true})
       setBImage('')
       setFImage('')
       setDescription('')
       setPostLoading(false)
       setUploadPost(false)
    } catch (error) {
        setPostLoading(false)
        console.log(error.message)      
    }
  }
  return (
    <div className='w-full min-h-[100vh] bg-[#eceaea]'>
      {edit && <EditProfile setEdit={setEdit} userData={userData} setUserData={setUserData} />}
      <Nav />
      <div className='flex flex-col lg:flex-row gap-5 mt-5 px-5'>
        <div className=' relative w-full p-1 lg:w-[25%] min-h-[200px] bg-white shadow-lg rounded-lg'>
          <div onClick={() => setEdit(prev => !prev)} className=' overflow-hidden relative cursor-pointer w-full h-[100px]  bg-gray-400 rounded-lg'>
            <img src={userData.coverImage || null} alt="" />
            <CiCamera className=' absolute right-2 top-2 text-xl font-semibold cursor-pointer text-white' />
          </div>
          <div onClick={() => setEdit(prev => !prev)} className=' absolute cursor-pointer top-[65px] left-[35px] w-[60px] h-[60px] rounded-full overflow-hidden -z-1'>
            <img src={userData.profileImage || userlogo} alt="" className='w-full' />
          </div>
          <div className='absolute cursor-pointer top-[100px] left-[75px] w-[15px] h-[15px] text-white rounded-full bg-blue-400  flex items-center'>
            <FiPlus className='font-bold ' />
          </div>
          <div className='mt-[30px] pl-5'>
            <div className='text-[18px] font-semibold text-gray-700'>{`${userData.firstName} ${userData.lastName}`}</div>
            <div className='text-[16px] text-gray-500'>{userData.headline || ""}</div>
            <div className='text-[16px] text-gray-500'>{userData.location}</div>
          </div>
          <button onClick={() => setEdit(prev => !prev)} className='w-full my-5 h-[40px] rounded-full  border-2 border-[#2dc0ff] flex items-center justify-center gap-2 text-[#2dc0ff]'>Edit Profile <FaPencilAlt /></button>
        </div>

        {/* middle */}
        <div className='w-full lg:w-[50%] min-h-[200px] flex flex-col gap-5'>
          <div className='w-full px-2  flex items-center gap-5 h-[100px] bg-white shadow-lg rounded-lg'>
            <div className=' cursor-pointer  w-[60px] h-[60px] rounded-full overflow-hidden -z-1'>
              <img src={userData.profileImage || userlogo} alt="" className='w-full' />
            </div>
            <button onClick={()=>setUploadPost(true)} className='w-[80%] h-[60px] border-2 text-start pl-2 rounded-full border-gray-500 hover:bg-slate-200'>start a post</button>
          </div>

           {
            postData.map((post, index)=>(
              <Post key={index} id={post._id} author={post.author} description={post.description} image={post.image} like={post.like} comment={post.comment} createdAt={post.createdAt}/>
            ))
           }
         
        </div>


        {/* left */}
        <div className='w-full lg:w-[25%] min-h-[200px] bg-white shadow-lg rounded-lg'>

        </div>
      </div>

      {/* post popup */}
      {uploadPost && <div className='flex items-center justify-center'>
        <div className='w-full h-full bg-black opacity-50 fixed top-0  z-[100] left-0'>
        </div>

        <div className='w-[90%] p-5 max-w-[400px] h-[500px] top-20 m-auto bg-white shadow-lg rounded-lg fixed z-[200]'>
          <RxCross1 onClick={()=>setUploadPost(false)} className=' cursor-pointer float-right  font-bold text-2xl' />
          <div className='flex items-center gap-2'>
            <div className=' cursor-pointer  w-[60px] h-[60px] rounded-full overflow-hidden -z-1'>
              <img src={userData.profileImage || userlogo} alt="" className='w-full' />
            </div>
            <div className='text-[18px] font-semibold text-gray-700'>{`${userData.firstName} ${userData.lastName}`}</div>

          </div>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className={`w-full  ${fImage?"h-[110px]":"h-[250px]"} mt-2 outline-none border p-2 resize-none text-[19px]`} placeholder='What you want to talk about..'></textarea>
          <div className='max-h-[200px] overflow-hidden float-right'>
            <img src={fImage || null} alt="" className='h-full' />
          </div>
          <div className='w-full absolute right-0 bottom-0 flex flex-col px-3'>
            <div className='w-full py-2 text-gray-500 flex items-center justify-start'>
              <FaImage onClick={() => image.current.click()} className='text-xl cursor-pointer' />
              <input type="file" hidden ref={image} onChange={handleImage} />

            </div>
            <div className='w-full h-[1px] bg-gray-500'></div>
            <div className='flex items-center justify-end'>
              <button disabled={postLoadin} onClick={handleUploadPost} className='w-24 my-5 h-[40px] rounded-full  border-2 border-[#2dc0ff] flex items-center justify-center gap-2 text-[#2dc0ff]'>{postLoadin?"Posting":"Post"}</button>
            </div>
          </div>
        </div>
      </div>}

    </div>
  )
}

export default Home