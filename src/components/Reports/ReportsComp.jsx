import React, { useState } from 'react'
import ReportsRightRouter from './RightRouter/reportsRightRouter'
import ReportsLeft from './LeftTable/ReportsLeft'
import './reports.css'

const ReportsComp = () => {
  const [datas, setDatas] = useState([]);
  const [loading, setLoading] = useState(false);
  return (
    <div className='reports-container'>
        <ReportsLeft loading={loading} setLoading={setLoading} datas={datas} setDatas={setDatas}/>
        <ReportsRightRouter loading={loading} setLoading={setLoading} datas={datas} setDatas={setDatas}/>
    </div>
  )
}

export default ReportsComp