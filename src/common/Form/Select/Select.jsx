import React from 'react'
import './select.css'

const Select = ({name = "", id = "",className='',options = []}) => {
  return (
    <select className={`select ${className ? className : ''}`} name={name} id={id}>
        {
            options.map((val,ind)=> <option value={val}>{val}</option> )
        }
    </select>
  )
}

export default Select