import React, { useState } from 'react'
import SnackbarAlert from '../../common/Alert/SnackbarAlert/SnackBarAlert'
import { apiFunction } from '../../Api/ApiFunction';
import { endPointURLs } from '../../Api/endPoints';
import { useNavigate } from 'react-router-dom';
import { path } from '../../router/Path';

const ForgetPassword = () => {
    const [isError, setIsError] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [msg, setMsg] = useState(false);

    const [isSubmitted, setisSubmitted] = useState(false);

    const [values, setValues] = useState({});

    const navigate = useNavigate()

    const handlechange = (e)=>{
        setValues({...values, [e.target.name] : e.target.value});
    }

    const handlesubmit = async(e)=>{
        e.preventDefault();
        const res = await apiFunction(endPointURLs.generateOtp, "POST", values)
        if(res.data.message == "success"){
            setIsSuccess(true)
            setMsg(`Otp Sented to ${values.gmail}`)
            setisSubmitted(true);
        }
        else{
            setIsError(true)
            setMsg(res.data.message)
        }

    }

    const onUpdate = async(e)=>{
        e.preventDefault();
        const res = await apiFunction(endPointURLs.verifyOtpUpdatePass,"POST",values);
        if(res.data.message == "success"){
            navigate(path.login);
        }
        else{
            setIsError(true)
            setMsg(res.data.message)
        }
    }
  return (
    <div className="login-container column">
      {isSuccess && <SnackbarAlert open={isSuccess} setOpen={setIsSuccess} message={msg}/>}
      {isError && <SnackbarAlert open={isError} setOpen={setIsError} severity="error" message={msg}/>}
      <form className="login-form" onSubmit={handlesubmit}>
        <h1>Forget Password</h1>
          <div>
            <input
              type={"email"}
              name={"gmail"}
              onChange={handlechange}
              placeholder={"Enter Email Address"}
              required={true}
            />
          </div>
        <button disabled={isSubmitted} className="log-button" type="submit">Send Otp</button>
      </form>
      {
        isSubmitted &&
        <form className='login-form' onSubmit={onUpdate}>
            <div>
                <input onChange={handlechange} name='otp' type="text" placeholder='Enter Your OTP' required/>
            </div>
            <div>
                <input onChange={handlechange} name='newPassword' type="text" placeholder='Enter New Password' required/>
            </div>
            <div>
                <input onChange={handlechange} name='confirmNewPassword' type="text" placeholder='Enter Confirm Password' required/>
            </div>
            <button className="log-button" type="submit">Change Password</button>
        </form>
      }
    </div>
  )
}

export default ForgetPassword