import React, { useEffect, useState } from 'react'
import Button from '../../../../common/Form/Buttton/Button'
import { collectionWiseArr } from './collectionReportsArr'
import LabelAndInput from '../../../../common/Form/LabeAndSelect.jsx/LabelAndInput'
import { apiFunction } from '../../../../Api/ApiFunction'
import { endPointURLs } from '../../../../Api/endPoints'
import SnackbarAlert from '../../../../common/Alert/SnackbarAlert/SnackBarAlert'
import { exportToExcel } from '../../../../utils/Excel/execl_fun'
import LabelAndInputSugg from '../../../../common/Form/LabeAndSelect.jsx/LabelAndInputSugg'

const CollectionReports = ({setDatas, datas, loading, setLoading}) => {
  const [agentsList, setAgentsList] = useState(["riswan"]);
  const [isErr, setIsErr] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [total, setTotal] = useState(0);
  const [cashTotal, setCashTotal] = useState(0);
  const [gpayTotal, setGpayTotal] = useState(0);
  const [values, setValues] = useState(
    {
      agent : "",
      id : "",
      yearMonth : ""
    }
  )
  const openFun = async()=>{
    setValues({...values, id : localStorage.getItem('user_id_num'), agent : localStorage.getItem('user_name')});
    setLoading(true);
    setDatas(
      [
        {
          "Agent Name" : "",
          "Area": '',
          "Cust_Name":'',
          "Loan Amount":'',
          "Due Date":'',
          "Amount":"",
          "Balance":"",
          "Entry Date":"",
          "Collected By":""
        }
      ]
    )
    const res = await apiFunction(endPointURLs.getAgentNamesAndAreas,"POST");
    if(res.data.message == "success"){
      setAgentsList(res.data.data);
    }
    setLoading(false);
  }
  useEffect(()=>{
    openFun()
  },[])

  const onChangeHandler = async(e)=>{
    let name = e.target.name;
    let value = e.target.value;
    if(name == "agent"){
      // const res = await apiFunction(endPointURLs.getAgentNamesAndAreas,"POST",{limit : 10, search_term : value});
      // if(res.data.message == "success"){
        // setAgentsList(res.data.data);
        let isExists = agentsList.find((val)=>val['name'].toLowerCase() == value.toLowerCase())
        if(isExists){
          setValues({...values, agent : value, id : isExists.id})
        }
        else{
          setValues({...values, agent : value, id : null})
        }
      // }
      // else{
      //   setValues({...values, agent : value, id : null})
      // }
    }
    else{
      setValues({...values, [name] : value})
    }
  }

  const onSubmitHandler = async()=>{
    setLoading(true);
    let month = null;
    let year = null;
    if(values.yearMonth){
        let yearAndMonth = values.yearMonth.split('-');
        year = yearAndMonth[0]
        month = yearAndMonth[1]
    }
    const res = await apiFunction(endPointURLs.collectionWiseReports,"POST",{agent_id : values.id, month : month, year : year})
    if(res.data.message == "success"){
      setDatas(res.data.data)
      setTotal(res.data.total_collection || res.data.total)
      setCashTotal(res.data.cash_total || 0)
      setGpayTotal(res.data.gpay_total || 0)
    }
    else{
      setIsErr(true);
      setErrMsg(res.data.message);
    }
    setLoading(false);
  }
  return (
    <div className='wise-reports'>
      {isErr && <SnackbarAlert open={isErr} setOpen={setIsErr} severity="error" message={errMsg}/>}
      <br />
      <div className="reports-heading">
        Collection Wise Reports
      </div>
      <br />
      <div className="daily-reports-inputs">
          <LabelAndInputSugg required={true} label={"Collection Agent"} name={"agent"} listName={"Agent"} dataList={agentsList} setDataList={setAgentsList} type={"text"} onChangeHandler={onChangeHandler} value={values.agent}/><br />
          <LabelAndInput required={true} label={"Year & Month"} name={"yearMonth"} listName={"month"} type={"month"} onChangeHandler={onChangeHandler} value={values.yearMonth}/><br />
        {/* {
          collectionWiseArr.map((val,ind)=><><LabelAndInput required={val.required} label={val.label} name={val.name} listName={val.listName} dataList={val.name == "agent" ? agentsList.map((val)=>val.name) : val.dataList} type={val.type} onChangeHandler={onChangeHandler}/><br /></>)
        } */}
      </div>
      <br />
      <div style={{display:"flex",justifyContent:"center"}}>
        <div>
          <Button className={'primary-btn'} onClick={onSubmitHandler}>Generate</Button>
        </div>
      </div>

      <div className="metrics-container">
        <div className="metric-card">
          <div className="metric-title">Cash Collection</div>
          <div className="metric-value">₹ {cashTotal}</div>
        </div>
        <div className="metric-card">
          <div className="metric-title">GPay Collection</div>
          <div className="metric-value">₹ {gpayTotal}</div>
        </div>
        <div className="metric-card">
          <div className="metric-title">Grand Total</div>
          <div className="metric-value">₹ {total}</div>
        </div>
      </div>
      <br />
      <div style={{display:"flex",justifyContent:"center"}}>
        <Button onClick={()=>exportToExcel(datas)}>To Excel</Button>
      </div>
      {/* <input type="text" value={total}/> */}
    </div>
  )
}

export default CollectionReports