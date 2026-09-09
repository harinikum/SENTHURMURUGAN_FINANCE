import React from 'react'
import './logOut.css'
import Button from '../../common/Form/Buttton/Button'
import { useNavigate } from 'react-router-dom'
import { path } from '../../router/Path'

const LogoutComp = () => {
    const navigate = useNavigate()

    const onLogOutClick = ()=>{
        localStorage.removeItem('token');
        localStorage.removeItem("user_id");
        localStorage.removeItem("user_id_num");
        localStorage.removeItem("user_name");
        localStorage.removeItem("issuperadmin");
        navigate(path.login)
    }
  return (
    <div className='log-out-par'>
        <div className="log-out-card">
            <div>
            <div className="log-out-title">
                Are You Sure to Logout!
            </div>
            <div className="log-out-btns">
                <Button className={"pop-cancel-btn"} onClick={()=>navigate(-1)}>Cancel</Button>
                <Button className={'pop-done-btn'} onClick={onLogOutClick}>Logout</Button>
            </div>
            </div>
        </div>
    </div>
  )
}

export default LogoutComp