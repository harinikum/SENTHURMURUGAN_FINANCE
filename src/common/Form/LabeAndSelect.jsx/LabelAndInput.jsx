import React from 'react';
import Select from '../Select/Select';
import './labelAndInput.css';

const LabelAndInput = ({label, id, type='text', dataList=[], name, listName='', required = true, checked, value, onChangeHandler=()=>{}, disabled }) => {
  return (
    <div className='label-and-input'>
          <label className='inp-label' htmlFor={id}>{label}</label>
          {type != "textarea" ? <input disabled={disabled} checked={checked} required={required} className='lab-input' type={type} id={id} name={name} list={listName} autoComplete='off' value={value} onChange={onChangeHandler} /> : <textarea style={{height:"200px"}} className='lab-input' name={name} id={id} value={value} onChange={onChangeHandler}></textarea> }
          {
            dataList && dataList.length>0 && 
            <datalist id={listName}>
              {
                dataList.map((val,ind)=> <option key={ind} value={val}>{val}</option> )
              }
            </datalist>
          }
    </div>
  )
}

export default LabelAndInput