import React from 'react'
import NormalTable from '../../../common/Table/NormalTable'
import BouncingDots from '../../../common/Loader/BouncingDots'

const ReportsLeft = ({datas, setDatas, loading}) => {
  return (
    <div className='reports-left'>
        <div className="table-container">
          {
            // datas.length > 0 ?
            !loading ? 
            <NormalTable tableDatas={datas}/>
            : <BouncingDots/>
            // : <h1>No Datas Found</h1>
          }
        </div>
    </div>
  )
}

export default ReportsLeft