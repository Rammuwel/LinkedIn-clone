import React, { useContext, useState } from 'react'
import logo from '../assets/logo.svg'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'
import { authContext } from '../context/AuthContext.jsx';
import { userDataContext } from '../context/UserContext.jsx';



function Login() {
    const [show, setShow] = useState(false); 
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoadin] = useState(false);
    const [err, seterr] = useState("")
    const navigate = useNavigate();
    
     const {userData, setUserData} = useContext(userDataContext)
    const {serverUrl} = useContext(authContext)
    const handleSignUp = async (e)=>{
        e.preventDefault()
        setIsLoadin(true)
        try {
            let {data} = await axios.post(serverUrl + '/api/auth/signin',
            {
                email,
                password
            }, {withCredentials:true})
            setIsLoadin(false)
           if(data.success){
              setEmail("");
              setPassword("");
              setUserData(data.user)
              navigate("/");
           }else{
              seterr(data.message);
           }
           
        } catch (error) {
            seterr('Server Error: '+ error.message)
            setIsLoadin(false)
        }
    }
    return (
      <div className='w-full h-screen bg-white flex flex-col items-center justify-start gap-[10px]'>
             <div className='p-5  w-full md:w-5/6'>
                <img src={logo} alt="LinkedIn" className='w-28'/>
             </div>
             <div className='w-[90%] max-w-[400px]  p-5 md:shadow-lg'>
                 <h1 className='text-gray-800 text-[30px] font-semibold'>Sign In</h1>
                 <form onSubmit={handleSignUp} className=' relative flex flex-col gap-5 mt-5'>
                      <input type="text" placeholder='userName Or Email'  value={email} onChange={(e)=>setEmail(e.target.value)} className='outline-none bg-gray-100 border py-2 px-4 text-gray-500 rounded-sm' required/>
                      <div className='w-full relative flex items-center'>
                      <input type={show?"text":"password"} placeholder='Password'  value={password} onChange={(e)=>setPassword(e.target.value)} className='outline-none bg-gray-100 w-full border py-2 px-4 text-gray-500 rounded-sm' required/>
                       <span onClick={()=>setShow(!show)} className='absolute right-2 text-sm text-blue-500 cursor-pointer'>{show?"Hide":"Show"}</span>
                      </div>
                     <button disabled={isLoading} type='submit' className='bg-blue-600 mt-5 text-white py-2 rounded-full'>{isLoading? "Loading..": "Sign In."}</button>
                     {err && <p className=' absolute bottom-14 text-red-400 text-center text-sm w-full'> {err} ! </p>}
                 </form>
                 <p className='mt-2 text-center text-gray-800'>You do not have an acount ? <Link to='/signup' className='text-blue-600'>Sign Up.</Link></p>  
             </div>
          </div>
    )
}

export default Login
