import React from 'react'
import './button.css';

const Button = ({children,id,className,type='button',onClick = ()=>{}, disabled}) => {
  return (
    <button disabled={disabled} id={id} className={className} type={type} onClick={onClick}>{children}</button>
  )
}

export default Button