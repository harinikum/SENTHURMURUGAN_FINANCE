import React, { useState } from 'react'
import './change_pass.css'
import ChangePassLeftForm from './Left/ChangePassLeftForm'
import ChangePassRight from './Right/ChangePassRight'
import { apiFunction } from '../../Api/ApiFunction'
import { endPointURLs } from '../../Api/endPoints'
import SnackbarAlert from '../../common/Alert/SnackbarAlert/SnackBarAlert'

const ChangePassComp = () => {
  const [values, setValues] = useState(
    {
      id : "",
      email : "",
      password : ""
    }
  );
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setisError] = useState(false);
  const [msg, setMsg] = useState("");
  const [selectedRow, setSelectedRow] = useState({});


  const onSubmitHandler = async(e)=>{
    e.preventDefault();
    const res = await apiFunction(endPointURLs.updateAgentPassword,"POST",{id : values.id && values.id,password : values.password});
    if(res.data.message == "Successfully Updated"){
      setIsSuccess(true);
    }
    else{
      setisError(true);
    }
    setMsg(res.data.message);
    setValues({
      id : "",
      email : "",
      password : ""
    })
    setSelectedRow({});
  }

  return (
    <div className="left-right-conatiner">
      {isSuccess && <SnackbarAlert open={isSuccess} setOpen={setIsSuccess} message={msg}/>}
      {isError && <SnackbarAlert open={isError} setOpen={setisError} severity="error" message={msg}/>}
          <ChangePassLeftForm values={values} setValues={setValues} onSubmitHandler={onSubmitHandler}/>
          <ChangePassRight selectedRow={selectedRow} setSelectedRow={setSelectedRow} values={values} setValues={setValues}/>
        </div>
  )
}

export default ChangePassComp