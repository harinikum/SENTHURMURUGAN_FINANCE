import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

const SuperAdminProtect = () => {
    // const Nav = Navigate();
    let isAdmin = localStorage.getItem('issuperadmin');
    if(isAdmin){
        isAdmin = isAdmin == "true"
    }
  return (
    isAdmin ? <Outlet/> : <Navigate to="/"/>
  )
}

export default SuperAdminProtect