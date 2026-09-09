import React, { useState } from 'react'
import LabelAndInputSugg from '../../../../common/Form/LabeAndSelect.jsx/LabelAndInputSugg'
import LabelAndInput from '../../../../common/Form/LabeAndSelect.jsx/LabelAndInput'
import Button from '../../../../common/Form/Buttton/Button'
import { customerTrashArr } from './customerTrashArr'

const CustomerTrashLeft = ({values={}, setValues=()=>{}, onRecoverClick=()=>{}}) => {

  const onSubmitHandler = (e)=>{
    e.preventDefault();
  }

  const onClearClick = ()=>{
    let tempObj = {};
    let keys = Object.keys(values);
    keys.forEach((val)=>{
      tempObj[val] = ""
    })
    setValues(tempObj)
  }

  return (
    <div className='form-left-container'>
      <form className="left-form" onSubmit={onSubmitHandler}>
        {
          customerTrashArr.map((val,ind)=><React.Fragment key={ind}><LabelAndInput label={val.label} id={val.name} required={val.required} name={val.name} type={val.type} disabled={val.disabled} value={values[val.name]} /> <br /></React.Fragment>)
        }
        <div className='btns-div'>
          <Button
            className={"primary-btn"}
            type={"button"}
            onClick={onRecoverClick}
          >
            {"Restore"}
          </Button>
          <Button
            className={"primary-btn"}
            type={"button"}
            onClick={onClearClick}
          >
            {"Clear"}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default CustomerTrashLeft