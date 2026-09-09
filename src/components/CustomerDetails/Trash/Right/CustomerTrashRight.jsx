import React, { useEffect, useState } from 'react'
import TableContainer from '../../../CommonTableContainer/TableContainer';
import { apiFunction } from '../../../../Api/ApiFunction';
import { endPointURLs } from '../../../../Api/endPoints';
import { tableFectchApi } from '../../../../utils/TableFunctions/tableFetchApi';
import BouncingDots from '../../../../common/Loader/BouncingDots';

const CustomerTrashRight = ({datas, setDatas, values, setValues=()=>{},hasMore, setHasMore}) => {
  const [ page, setPage] = useState(0);
  // const [hasMore, setHasMore] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  // const [searchInp, set]

  const openFun = async()=>{
    const filters = {
      // "search_term" : searchInp,
      "limit" : 12,
      "offset" : page,
    }
    const res = await tableFectchApi( {data : datas, setData : setDatas, filters : filters, setHasMore : setHasMore, URL : endPointURLs.getDeletedMembers, method : "POST"});
    setLoaded(true);
  }

  useEffect(()=>{
    openFun();
  },[])

  const scrollFunction = async(filters={})=>{
    await tableFectchApi({data : datas, setData:setDatas , filters : filters, setHasMore : setHasMore,URL : endPointURLs.getDeletedMembers, method : "POST"})
    setLoaded(true);
    setTableLoading(false);
  }

  const onTableClick = async(row)=>{
    setValues({
      id : row['id'],
      customerName : row["Customer Name"],
      contactNumber : row["Contact Number"],
      aadharNumber : row["Aadhar Number"],
      panNumber : row["Pan Number"]
    });
  }
  return (
    <div className='table-right' id='table-right-entry'>
      {
        loaded ?
        <div className="table-conatainer-search">
        {/* <NormalTable/> */}
        <TableContainer selectedRow={values} setSelectedRow={setValues}  scrollFunction={scrollFunction}  page={page} setPage={setPage} loading={tableLoading} setLoading={setTableLoading} datas={datas} hasMore={hasMore} title='Members' tableOnClick={onTableClick}/>
      </div> : <BouncingDots/>
      }
    </div>
  )
}

export default CustomerTrashRight