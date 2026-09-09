import React from 'react'
import ReportsBtns from './ReportsBtns/ReportsBtns'
import {reportBtnsArrTop,reportBtnsArrBottom} from './reportButtonsArr.js'

const ReportsLayout = ({clicked, setClicked}) => {
  return (
    <div className='reports-right-btns'>
        <div className="reports-nav-btns">
            <ReportsBtns clicked={clicked} setClicked={setClicked} btns={reportBtnsArrTop}/>
            <ReportsBtns clicked={clicked} setClicked={setClicked} btns={reportBtnsArrBottom}/>
        </div>
    </div>
  )
}

export default ReportsLayout