import React, { createContext, useContext, useEffect, useState } from 'react'
import { authContext } from './AuthContext';
import axios from 'axios';
import {io} from 'socket.io-client'


export const userDataContext = createContext();

export let socket = io("http://localhost:8000")

function UserContext({ children }) {
    const [edit, setEdit] = useState(false);

    const [userData, setUserData] = useState([]);
    const [postData, setPostData] = useState([])
    const { serverUrl } = useContext(authContext)

    const getCurrentUserData = async () => {
        try {
            let { data } = await axios.get(serverUrl + '/api/user/currentuser',
                {
                  withCredentials: true
                })
            if (data.user) {
                setUserData(data.user)
            } else {
                setUserData(null)
            }
        } catch (error) {
            console.log(error.message)
            setUserData(null)
        }
    }
    

    const fetchPosts = async () => {

        try {
            let { data } = await axios.get(serverUrl + "/api/post/getpost", {withCredentials:true})

            if(data.success){
               setPostData(data.posts.reverse())

            }else{
                setPostData(null)
            }
        } catch (error) {
            setPostData(null)
           console.log(error.message)
        }
    }

   
    useEffect(() => {
         getCurrentUserData();
        fetchPosts();
    }, [])
    const value = {
        userData,
        setUserData,
        edit,
        setEdit,
        postData,
        setPostData,
        fetchPosts
    }
    return (
        <div>
            <userDataContext.Provider value={value}>
                {children}
            </userDataContext.Provider>
        </div>
    )
}

export default UserContext