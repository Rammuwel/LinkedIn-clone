import React, { createContext } from 'react'

export const authContext = createContext();
const serverUrl = "http://localhost:8000"


function AuthContext({children}) {

  let value = {
    serverUrl,
}

  return (
    <div>
       <authContext.Provider value={value}>
        {children}
       </authContext.Provider> 
    </div>
  )
}

export default AuthContext