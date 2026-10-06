import React, { useEffect, useState } from 'react'
import NormalTable from '../../../common/Table/NormalTable'
import TableContainer from '../../CommonTableContainer/TableContainer';
import BouncingDots from '../../../common/Loader/BouncingDots';
import { tableFectchApi } from '../../../utils/TableFunctions/tableFetchApi';
import { endPointURLs } from '../../../Api/endPoints';
import { apiFunction } from '../../../Api/ApiFunction';
import { getCredintials } from '../../../utils/locatStorage/getCerditials';
import { getCategoryFromNumber } from '../../../common/utils/categoryUtils';

const getItemCategory = (item) => {
  if (!item) return '';
  let cat = item.Category || item.category;
  if (!cat || !cat.toString().trim()) {
    const noteNum = item['உ.எண்'] || item['note_id'] || item['id'];
    cat = getCategoryFromNumber(noteNum);
  }
  return (cat || '').toString().trim().toUpperCase();
};

const getNoteNumber = (item) => {
  if (!item) return 0;
  const num = item['உ.எண்'] ?? item['note_id'] ?? item['id'] ?? 0;
  return Number(num) || 0;
};

const uniqueDatas = (arr) => {
  if (!Array.isArray(arr)) return [];
  const seen = new Set();
  return arr.filter(item => {
    if (!item) return false;
    const key = item.id || item.hideMemberId || `${item['உ.எண்'] || ''}-${item['Customer Name'] || ''}`;
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const CustomerDetailsRight = ({viewCategory="", setViewCategory=()=>{}, values, setValues=()=>{}, buttons=[], setButtons=()=>{},custDetailArrState, setCustDetailArrState, afterMembers, setAfterMembers, datas, setDatas, hasMore, setHasMore}) => {
  // const [datas, setDatas] = useState([]);
  const [ page, setPage] = useState(0);
  // const [hasMore, setHasMore] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  // const [searchInp, set]

  const openFun = async()=>{
    let currentAgent = values.agent || "";
    const isSuperAdmin = getCredintials().isSuperAdmin;
    if(!currentAgent && isSuperAdmin !== "true"){
      const res = await apiFunction(endPointURLs.getParticularAgent,"POST",{email_id : getCredintials().email});
      if(res.data.message == "success"){
        if(res.data.data.length){
          currentAgent = res.data.data[0]['Agent Name'];
          setValues(prev => ({...prev, agentId : res.data.data[0]['id'], agent : currentAgent}));
        }
      }
    }
    const filters = {
      "limit" : 1000,
      "offset" : 0,
      "agent_name" : currentAgent,
      ...(viewCategory ? { category: viewCategory } : {})
    }
    setPage(0);
    await tableFectchApi( {data : [], setData : setDatas, filters : filters, setHasMore : setHasMore, URL : endPointURLs.getMembers, method : "POST"});
    setHasMore(false);
    setLoaded(true);
  }

  useEffect(()=>{
    openFun();
  },[values.agent, viewCategory])

  const scrollFunction = async(filters={})=>{
    let agentName = "";
    const isSuperAdmin = getCredintials().isSuperAdmin;
    if(!values.agent && isSuperAdmin !== "true"){
      const res = await apiFunction(endPointURLs.getParticularAgent,"POST",{email_id : getCredintials().email});
      if(res.data.message == "success"){
        if(res.data.data.length){
          agentName = res.data.data[0]['Agent Name'];
        }
      }
    }
    const reqFilters = {
      ...filters,
      agent_name : values.agent || agentName,
      ...(viewCategory ? { category: viewCategory } : {})
    };
    await tableFectchApi({data : datas, setData:setDatas , filters : reqFilters, setHasMore : setHasMore,URL : endPointURLs.getMembers, method : "POST"})
    setLoaded(true);
    setTableLoading(false);
  }

  const onTableClick = async(row)=>{
    console.log(row)
    setValues({
      id : row['id'],
      // noteId : row['உ.எண்'],
      agent : row['Agent Name'],
      area : row["Area"],
      customerName : row["Customer Name"],
      contactNumber : row["Contact Number"],
      place : row["Place"],
      category : row["Category"] || row["category"] || getItemCategory(row),
      loanAmount : row["Loan Amount"],
      balanceAmount : row["Balance Amount"],
      emiAmount : row["Emi Amount"],
      dateOfLoan : row["Date Of Loan"],
      addAfter : row['hideBefore'],
      agentId : row['hideAgentId'],
      emiId : row['hideEmiID'],
    });
    const afterApi = await apiFunction(endPointURLs.getAfterMembers,"POST",{agent_id : row['hideAgentId']});
        if(afterApi.data.message == "success"){
          setCustDetailArrState(custDetailArrState.map((val)=>val.name == "addAfter" ? {...val,dataList : afterApi.data.data.map((val)=>val['Customer Name'])} : val));
          setAfterMembers(afterApi.data.data);
        }
    setButtons(buttons.map((btns)=>(btns.name != "Add New" ? {...btns,isDisable : false} : {...btns, isDisable : true})));
    
  }

  const filteredDatas = uniqueDatas(
    viewCategory && viewCategory.trim() !== ""
      ? datas.filter(item => getItemCategory(item) === viewCategory.trim().toUpperCase())
      : datas
  ).slice().sort((a, b) => getNoteNumber(a) - getNoteNumber(b));

  return (
    <div className='table-right' id='table-right-entry'>
      {
        loaded ?
        <div className="table-conatainer-search">
        {/* <NormalTable/> */}
        <TableContainer selectedRow={values} setSelectedRow={setValues}  scrollFunction={scrollFunction}  page={page} setPage={setPage} loading={tableLoading} setLoading={setTableLoading} datas={filteredDatas} hasMore={hasMore} title='Members' tableOnClick={onTableClick}/>
      </div> : <BouncingDots/>
      }
    </div>
  )
}

export default CustomerDetailsRight