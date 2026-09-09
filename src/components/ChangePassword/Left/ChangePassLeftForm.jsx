import React, { useState } from 'react'
import LabelAndInput from '../../../common/Form/LabeAndSelect.jsx/LabelAndInput'
import Button from '../../../common/Form/Buttton/Button';
import { apiFunction } from '../../../Api/ApiFunction';
import { endPointURLs } from '../../../Api/endPoints';

const ChangePassLeftForm = ({values, setValues, onSubmitHandler}) => {
    
    const onChangeHandler = (e)=>{
      setValues({...values, [e.target.name] : e.target.value});
    }

    // const onSubmitHandler = async(e)=>{
    //   e.preventDefault();
    //   const res = await apiFunction(endPointURLs.updateAgentPassword,"POST",{id : values.id && values.id,password : values.password})
    // }
  return (
    <div className='form-left-container'>
      <form className="left-form" onSubmit={onSubmitHandler}>
        <br />
        <LabelAndInput disabled={true} label={'Email ID'} required={true} name={'email'} value={values.email}/>
        <br />
        <LabelAndInput label={'Password'} required={true} name={'password'} value={values.password} onChangeHandler={onChangeHandler}/>
        <br />
        <div className="updt-btn-par">
          <div className="btn-width-controll">
          <Button type='submit' className={"primary-btn"}>Update</Button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default ChangePassLeftForm