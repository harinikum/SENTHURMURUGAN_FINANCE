import React, { useEffect, useState } from 'react'
import NormalTable from '../../../common/Table/NormalTable'
import { apiFunction } from '../../../Api/ApiFunction';
import { endPointURLs } from '../../../Api/endPoints';
import TableContainer from '../../CommonTableContainer/TableContainer';
import { tableFectchApi } from '../../../utils/TableFunctions/tableFetchApi';
import BouncingDots from '../../../common/Loader/BouncingDots';

const AgentRegisterRight = ({values, setValues=()=>{}, buttons=[], setButtons=()=>{}}) => {
  const [datas, setDatas] = useState([]);
  const [ page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  // const [searchInp, set]

  const openFun = async()=>{
    const filters = {
      // "search_term" : searchInp,
      "limit" : 12,
      "offset" : page*12,
    }
    const res = await tableFectchApi( {data : datas, setData : setDatas, filters : filters, setHasMore : setHasMore, URL : endPointURLs.getAgents, method : "POST"});
    setLoaded(true);
  }

  useEffect(()=>{
    openFun();
  },[])

  const scrollFunction = async(filters={})=>{
    await tableFectchApi({data : datas, setData:setDatas , filters : filters, setHasMore : setHasMore,URL : endPointURLs.getAgents, method : "POST"})
    setLoaded(true);
    setTableLoading(false);
  }

  const onTableClick = (row)=>{
    setValues({
      id : row['id'],
      agentName : row['Agent Name'],
      agentAddress : row["Address"],
      aadharNo : row["Aadhar Number"],
      contactNo : row["Contact Number"],
      area : row["Area"]
    });
    setButtons(buttons.map((btns)=>(btns.name != "Add New" ? {...btns,isDisable : false} : {...btns, isDisable : true})));
  }

  const onDeleteClick = async (row) => {
    if (window.confirm(`Are you sure you want to delete the agent: ${row['Agent Name']}?`)) {
      try {
        const res = await apiFunction(endPointURLs.deleteAgent, "POST", { id: row['id'] });
        if (res.data.message === "Successfully Deleted") {
          setDatas(prev => prev.filter(item => Number(item.id) !== Number(row.id)));
          alert("Agent deleted successfully.");
        } else {
          alert("Failed to delete agent: " + (res.data.message || "Unknown error"));
        }
      } catch (error) {
        alert("An error occurred while deleting the agent.");
        console.error(error);
      }
    }
  };

  return (
    <div className='table-right'>
      {
        loaded ?
        <div className="table-conatainer-search">
        {/* <NormalTable/> */}
        <TableContainer selectedRow={values} setSelectedRow={setValues}  scrollFunction={scrollFunction}  page={page} setPage={setPage} loading={tableLoading} setLoading={setTableLoading} datas={datas} hasMore={hasMore} title='Agents' tableOnClick={onTableClick} onDeleteClick={onDeleteClick}/>
      </div> : <BouncingDots/>
      }
      
    </div>
  )
}

export default AgentRegisterRight