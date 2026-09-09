import React from 'react'
import { onSubmitHandler } from '../functions'
import Button from '../../../common/Form/Buttton/Button'
import { summaryEntryArr } from './summaryEntryArr'
import LabelAndInput from '../../../common/Form/LabeAndSelect.jsx/LabelAndInput'

const SummaryEntyLeft = () => {
  
  return (
    <div className='form-left-container'>
      <form className="left-form" onSubmit={onSubmitHandler}>
        <br />
        {
          summaryEntryArr.map((val,ind)=><><LabelAndInput key={ind} label={val.label} id={val.name} required={val.required} type={val.type} listName={val.listName} dataList={val.dataList} /> <br /> </>)
        }
        <div style={{display:"flex",justifyContent:"space-around"}}>
            <LabelAndInput type='checkbox' label={'Return'} id={'return'} name={'type'}/>
            <LabelAndInput type='checkbox' label={'Paid'} id={'paid'} name={'type'}/>
        </div>
        <br />
        <div className='btns-div'>
          <Button className={'primary-btn'} type='button'>Add Details</Button>
          <Button className={'primary-btn'} type='button'>Close</Button>
        </div>
      </form>
    </div>
  )
}

export default SummaryEntyLeft