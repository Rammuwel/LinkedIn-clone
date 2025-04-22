import React, { useContext } from "react"
import { Navigate, Route, Routes } from "react-router-dom"
import Home from "./pages/Home.jsx"
import SignUp from "./pages/SignUp.jsx"
import Login from "./pages/Login.jsx"
import { userDataContext } from "./context/UserContext.jsx"
import Network from "./pages/Network"
import Profile from "./pages/Profile.jsx"
import Notification from "./pages/Notification.jsx"

function App() {
  
  const {userData} = useContext(userDataContext)
  return (
    <Routes>
      <Route path="/" element={userData.length > 0 ?<Home/>:<Navigate to="/login"/>}/>
      <Route path="/login" element={userData.length === 0?<Login/>:<Navigate to="/"/>}/>
      <Route path="/signup" element={userData.length === 0?<SignUp/>:<Navigate to="/"/>}/>
      <Route path="/network" element={userData.length > 0?<Network/>:<Navigate to="/login"/>}/>
      <Route path="/profile/:id" element={userData.length > 0?<Profile/>:<Navigate to="/login"/>}/>
      <Route path="/notification" element={userData.length > 0?<Notification/>:<Navigate to="/login"/>}/>
    </Routes>
  )
}

export default App
