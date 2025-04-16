import React, { createContext, useContext, useEffect, useState } from 'react'
import { authContext } from './AuthContext';
import axios from 'axios';


export const userDataContext = createContext();



function UserContext({children}) {
     
    const [userData, setUserData] = useState([]);

    const {serverUrl} = useContext(authContext)

    const getCurrentUserData = async ()=>{
        try {
            let {data} = await axios.get(serverUrl+'/api/user/currentuser', 
                {
                   withCredentials: true 
                })
             if(data.user){
                setUserData(data.user)
             }else{
                setUserData([])
             }
        } catch (error) {
            console.log(error.message)
        }
    } 
    const value = {
        userData,
    }

    useEffect(()=>{
        getCurrentUserData();
    },[])
  return (
    <div>
       <userDataContext.Provider value={value}>
       {children}
       </userDataContext.Provider>
    </div>
  )
}

export default UserContext