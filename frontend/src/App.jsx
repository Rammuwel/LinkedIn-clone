import React, { useContext } from "react"
import { Navigate, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import SignUp from "./pages/SignUp"
import Login from "./pages/Login"
import { userDataContext } from "./context/UserContext.jsx"
import Network from "./pages/Network"

function App() {
  
  const {userData} = useContext(userDataContext)
  return (
    <Routes>
      <Route path="/" element={userData?<Home/>:<Navigate to="/login"/>}/>
      <Route path="/login" element={!userData?<Login/>:<Navigate to="/"/>}/>
      <Route path="/signup" element={!userData?<SignUp/>:<Navigate to="/"/>}/>
      <Route path="/network" element={userData?<Network/>:<Navigate to="/login"/>}/>
    </Routes>
  )
}

export default App
