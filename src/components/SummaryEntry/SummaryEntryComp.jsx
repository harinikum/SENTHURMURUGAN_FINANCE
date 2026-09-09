import React from 'react'
import SummaryEntyLeft from './Left/SummaryEntyLeft'
import SummaryEntryRight from './Right/SummaryEntryRight'

const SummaryEntryComp = () => {
  return (
    <div className='left-right-conatiner'>
        <SummaryEntyLeft/>
        <SummaryEntryRight/>
    </div>
  )
}

export default SummaryEntryComp