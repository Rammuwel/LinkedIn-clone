import React, { useContext, useState } from 'react'
import logo from '../assets/logo.svg'
import { Link, useNavigate } from 'react-router-dom'
import { authContext } from '../context/AuthContext.jsx';
import axios from 'axios';
import { userDataContext } from '../context/UserContext.jsx';

function SignUp() {
    const [show, setShow] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoadin] = useState(false);
    const [err, seterr] = useState("")
    const navigate = useNavigate();
    
    const {serverUrl} = useContext(authContext);
    const {userData, setUserData} = useContext(userDataContext)
    
    const handleSignUp = async (e)=>{
        e.preventDefault()
        setIsLoadin(true)
        try {
            let {data} = await axios.post(serverUrl + '/api/auth/signup',
            {
                firstName,
                lastName,
                userName,
                email,
                password
            }, {withCredentials:true})

           if(data.success){
              setFirstName("");
              setLastName("");
              setUserName("");
              setEmail("");
              setPassword("");
              setUserData(data.user)
              navigate("/");
           }else{
            seterr(data.message)
           }

           setIsLoadin(false)
        } catch (error) {
            console.log(error.message)
            setIsLoadin(true)
        }
    }

  return (
    <div className='w-full h-screen bg-white flex flex-col items-center justify-start gap-[10px]'>
       <div className='p-5  w-full md:w-5/6'>
          <img src={logo} alt="LinkedIn" className='w-28'/>
       </div>
       <div className='w-[90%] max-w-[400px] relative p-5 md:shadow-lg'>
           <h1 className='text-gray-800 text-[30px] font-semibold'>Sign Up</h1>
          
           <form onSubmit={handleSignUp} className='flex flex-col relative gap-5 mt-8'>
               <input type="text" placeholder='First Name' value={firstName} onChange={(e)=>setFirstName(e.target.value)} className='outline-none bg-gray-100 border py-2 px-4 text-gray-500 rounded-sm' required/>
               <input type="text" placeholder='Last Name'  value={lastName} onChange={(e)=>setLastName(e.target.value)} className='outline-none bg-gray-100 border py-2 px-4 text-gray-500 rounded-sm' required/>
               <input type="text" placeholder='Username'  value={userName} onChange={(e)=>setUserName(e.target.value)} className='outline-none bg-gray-100 border py-2 px-4 text-gray-500 rounded-sm' required/>
               <input type="text" placeholder='Email'  value={email} onChange={(e)=>setEmail(e.target.value)} className='outline-none bg-gray-100 border py-2 px-4 text-gray-500 rounded-sm' required/>
                <div className='w-full relative flex items-center'>
                <input type={show?"text":"password"} placeholder='Password'  value={password} onChange={(e)=>setPassword(e.target.value)} className='outline-none bg-gray-100 w-full border py-2 px-4 text-gray-500 rounded-sm' required/>
                 <span onClick={()=>setShow(!show)} className='absolute right-2 text-sm text-blue-500 cursor-pointer'>{show?"Hide":"Show"}</span>
                </div>
              
               <button disabled={isLoading} type='submit' className='bg-blue-600 text-white mt-5 py-2 rounded-full'>{isLoading?"Loading":"Sign Up"}</button>
               {err && <p className=' absolute bottom-14 text-red-400 text-center text-sm w-full'> {err} ! </p>}
           </form>
           <p className='mt-2 text-center text-gray-800'>Already have an acount? <Link to='/login' className='text-blue-600'>Sign In.</Link></p>  
           
       </div>
    </div>
  )
}

export default SignUp