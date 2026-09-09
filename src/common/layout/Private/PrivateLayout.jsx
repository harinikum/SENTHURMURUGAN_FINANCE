import React from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import './privateLayout.css'
import { navItems } from './navItems'

const PrivateLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHeadingActive = (val)=>{
    let splitted = location.pathname.split('/');
    // console.log(splitted)
    return `/${splitted[1]}` == val;
  } 
  const onNavClick = (path)=>{
    navigate(path);
  }

  const isAccess = ()=>{
    const isSuperAdmin = localStorage.getItem('issuperadmin');
    return isSuperAdmin == "true";
  }

  return (
    <div style={{height:"100vh",width:"100vw",}}>
        <div className="header-nav">
          {
            navItems.map((val,ind)=>((!val.superAdminOnly || isAccess()) &&<div className={isHeadingActive(val.path) ? 'nav-btns-selected' : 'nav-btns'} key={ind} onClick={()=>onNavClick(val.path)}>{val.title}</div>))
          }
        </div>
      <div className="private-body" id='nav-root'>
        <Outlet/>
      </div>
    </div>
  )
}

export default PrivateLayout