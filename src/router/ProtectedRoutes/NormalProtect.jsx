import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

const NormalProtect = () => {
    // const Nav = Navigate();
    let tok = localStorage.getItem('token');
  return (
    tok ? <Outlet/> : <Navigate to="/"/>
  )
}

export default NormalProtect