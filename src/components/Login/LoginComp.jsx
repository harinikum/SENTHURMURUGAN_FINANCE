import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { path } from "../../router/Path";
import SnackbarAlert from "../../common/Alert/SnackbarAlert/SnackBarAlert";
import { apiFunction } from "../../Api/ApiFunction";
import { endPointURLs } from "../../Api/endPoints";

import Logo from '../../assets/LOGO/logo.png';

const LoginComp = () => {
  const [isError, setIsError] = useState(false);
  const [msg, setMsg] = useState("");

  const [LoginData, setLoginData] = useState({
    Email: "",
    Password: "",
  });

  const navigate = useNavigate();

  const [errors, setErrors] = useState({
    Email: false,
    Password: false,
  });

  const Field = [
    { name: "Email", error: "Incorrect email" },
    { name: "Password", error: "Incorrect password" },
  ];

  const handlechange = (value, name) => {
    setLoginData((preData) => ({ ...preData, [name]: value }));
  };

  const handlesubmit = async(e) => {
    e.preventDefault();
    const res = await apiFunction(endPointURLs.verifyAgent,"POST",{email_id : LoginData.Email, password : LoginData.Password});
    if(res.data.message == "success"){
      localStorage.setItem('user_id',LoginData.Email);
      localStorage.setItem('user_id_num',res.data.id);
      localStorage.setItem('user_name',res.data.name);
      localStorage.setItem('token',res.data.token);
      localStorage.setItem('issuperadmin',res.data.super_admin);
      // if(res.data.super_admin){
      //   localStorage.setItem('isSuperAdmin',res.data.super_admin);
      // }
      // else{
      //   localStorage.removeItem('isSuperAdmin');
      // }
      navigate(path.newEntry)
    }
    else{
      localStorage.removeItem('user_id');
      localStorage.removeItem('token');
      localStorage.removeItem('isSuperAdmin');
      setIsError(true);
      setMsg(res.data.message);
    }


    // if (isEmailCorrect && isPasswordCorrect) {
    //   navigate(path.dailyEntry);
    // } else {
    //   console.log("Login failed");
    // }
  };

  return (
    <div className="login-container">
      {isError && <SnackbarAlert open={isError} setOpen={setIsError} severity="error" message={msg}/>}
      <form className="login-form" onSubmit={handlesubmit}>
        <div>
          <img src={Logo} alt="" height={'100'} width={'100'} />
        </div>
        <h1>ஸ்ரீ செந்தூர் முருகன் (VSB)</h1>
        {Field.map((field, index) => (
          <div key={index}>
            <input
              type={field.name.toLowerCase()}
              onChange={(e) => handlechange(e.target.value, field.name)}
              placeholder={field.name}
              required={true}
            />
            {errors[field.name] && (
              <p className="error-message">{field.error}</p>
            )}
          </div>
        ))}
        <button className="log-button" type="submit">Login</button>
        <p className="forget-pass"><span onClick={()=>navigate(path.forgetPassword)}>Forget Password</span></p>
        {/* <Button className="log-button" letter="Login" type="submit" /> */}
      </form>
    </div>
  );
};

export default LoginComp;