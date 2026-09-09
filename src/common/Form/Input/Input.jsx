import React from 'react'
import './Input.css'

const Input = ({type='text',onChange=()=>{},className='',id='',required, name, value}) => {
  return (
    <input name={name} type={type} className={className} id={id} onChange={onChange} required={required} value={value} />
  )
}

export default Input