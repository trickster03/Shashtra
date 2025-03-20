import React from 'react'
import {Route,Routes} from 'react-router-dom'
import Login from '../../views/Login.jsx'
import Signup from '../../views/Signup.jsx'
const AuthRoute=()=>{
    return(
        <Routes>
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
        </Routes>
    )

}

export default AuthRoute;