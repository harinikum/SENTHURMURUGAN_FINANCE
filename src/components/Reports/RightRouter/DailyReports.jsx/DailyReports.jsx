import React, { useEffect, useState } from 'react'
import LabelAndInput from '../../../../common/Form/LabeAndSelect.jsx/LabelAndInput'
import { dailyreportsArr } from './dailyReportsArr'
import Button from '../../../../common/Form/Buttton/Button'
import { endPointURLs } from '../../../../Api/endPoints'
import { apiFunction } from '../../../../Api/ApiFunction'
import LabelAndInputSugg from '../../../../common/Form/LabeAndSelect.jsx/LabelAndInputSugg'
import { exportToExcel } from '../../../../utils/Excel/execl_fun'
import { getCredintials } from '../../../../utils/locatStorage/getCerditials'

const DailyReports = ({datas=[], setDatas=()=>{}, loading, setLoading}) => {
  const [agentList, setAgentsList] = useState([]);
  // const [values, setValues] = useState({
  //   id : null,
  //   agent : "",
  //   selectDate : "",
  //   radioType : ""
  // });
  const [values, setValues] = useState({
    id : "all",
    agent : "All",
    selectDate : "",
    radioType : ""
});
  const [totAmount, setTotAmount] = useState(0);
  const [cashTotal, setCashTotal] = useState(0);
  const [gpayTotal, setGpayTotal] = useState(0);

  const openFun = async()=>{
    setLoading(true)
    setValues({
    ...values,
    id : "all",
    agent : "All"
});
    // setValues({...values, id : localStorage.getItem('user_id_num'), agent : localStorage.getItem('user_name')});
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
      // setAgentsList(res.data.data);
        setAgentsList([
        {
            id: "all",
            name: "All"
        },
        ...res.data.data
    ]);
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
        if(value.toLowerCase() === "all"){
        setValues({
            ...values,
            agent: "All",
            id: "all"
        });
        return;
    }

        let isExists = agentList.find((val)=>val['name'].toLowerCase() == value.toLowerCase())
        
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

  const onGenerate = async()=>{
    setLoading(true);
    if(values.radioType == "collection"){
      const res = await apiFunction(endPointURLs.collectionWiseReports,"POST",{agent_id : values.id, date : values.selectDate})
      if(res.data.message == "success"){
        setDatas(res.data.data)
        setTotAmount(res.data.total_collection || res.data.total)
        setCashTotal(res.data.cash_total || 0)
        setGpayTotal(res.data.gpay_total || 0)
      }
    }
    else if(values.radioType == "newloan"){
      const res = await apiFunction(endPointURLs.getNewLoanReports,"POST",{agent_id : values.id, date : values.selectDate})
      if(res.data.message == "success"){
        setDatas(res.data.data)
        setTotAmount(res.data.total)
      }
    }
    setLoading(false);
  }

  return (
    <div className='wise-reports'>
      <br />
      <div className="reports-heading">
        Day Wise Reports
      </div>
      <br />
      <div className="daily-reports-radios">
        <div>
          <input type="radio" name={"radioType"} id="collection" value={'collection'} onChange={onChangeHandler} />
          <label htmlFor="collection">Collection</label>
        </div>

        <div>
          <input type="radio" name={"radioType"} id="newloan" value={'newloan'} onChange={onChangeHandler} />
          <label htmlFor="newloan">New Loan Details</label>
        </div>
          {/* {
            getCredintials().isSuperAdmin == "true" &&
            <div>
             <input type="radio" name={"radioType"} id="summary" value={'summary'} onChange={onChangeHandler} />
             <label htmlFor="summary">Summary Entry</label>
            </div>
          } */}
      </div>
      <br />
      <div className="daily-reports-inputs">
        {/* {
          dailyreportsArr.map((val,ind)=><><LabelAndInput label={val.label} name={val.name} listName={val.listName} dataList={val.dataList} type={val.type}/><br /></>)
        } */}
        <LabelAndInputSugg value={values.agent} label={"Agent"} name={"agent"} listName={"Agent"} dataList={agentList} setDataList={setAgentsList} type={"text"} onChangeHandler={onChangeHandler}/><br />
        <LabelAndInput label={"Selected Date"} name={"selectDate"} type={"date"} onChangeHandler={onChangeHandler}/><br />
      </div>
      <br />
      <div style={{display:"flex",justifyContent:"center"}}>
        <div>
          <Button disabled={loading} className={'primary-btn'} onClick={onGenerate}>Generate</Button>
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
          <div className="metric-value">₹ {totAmount}</div>
        </div>
      </div>
      <br />
      <div style={{display:"flex",justifyContent:"center"}}>
        <Button onClick={()=>exportToExcel(datas)}>To Excel</Button>
      </div>
    </div>
  )
}

export default DailyReports