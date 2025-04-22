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
      <Route path="/" element={userData?<Home/>:<Navigate to="/login"/>}/>
      <Route path="/login" element={!userData?<Login/>:<Navigate to="/"/>}/>
      <Route path="/signup" element={!userData?<SignUp/>:<Navigate to="/"/>}/>
      <Route path="/network" element={userData?<Network/>:<Navigate to="/login"/>}/>
      <Route path="/profile/:id" element={userData?<Profile/>:<Navigate to="/login"/>}/>
      <Route path="/notification" element={userData?<Notification/>:<Navigate to="/login"/>}/>
    </Routes>
  )
}

export default App
