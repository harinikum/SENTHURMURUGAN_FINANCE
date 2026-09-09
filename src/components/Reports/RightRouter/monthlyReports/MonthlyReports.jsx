import React, { useEffect, useState } from 'react'
import { apiFunction } from '../../../../Api/ApiFunction';
import { endPointURLs } from '../../../../Api/endPoints';
import LabelAndInput from '../../../../common/Form/LabeAndSelect.jsx/LabelAndInput';
import Button from '../../../../common/Form/Buttton/Button';
import LabelAndInputSugg from '../../../../common/Form/LabeAndSelect.jsx/LabelAndInputSugg';
import { exportToExcel } from '../../../../utils/Excel/execl_fun';
import { getCredintials } from '../../../../utils/locatStorage/getCerditials';

const MonthlyReports = ({datas=[], setDatas=()=>{}, loading, setLoading}) => {
  const [agentList, setAgentsList] = useState([]);
  const [values, setValues] = useState({
    id : null,
    agent : "",
    selectDate : "",
    radioType : ""
  });

  const [totAmount, setTotAmount] = useState(0);

  const openFun = async()=>{
    setLoading(true)
    setValues({...values, id : localStorage.getItem('user_id_num'), agent : localStorage.getItem('user_name')})
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
    setLoading(false)
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
    let month = null;
    let year = null;
    if(values.selectDate){
        let yearAndMonth = values.selectDate.split('-');
        year = yearAndMonth[0]
        month = yearAndMonth[1]
    }
    if(values.radioType == "collection"){
      const res = await apiFunction(endPointURLs.collectionWiseReports,"POST",{agent_id : values.id, month : month, year : year})
      if(res.data.message == "success"){
        setDatas(res.data.data)
        setTotAmount(res.data.total)
      }
    }
    else if(values.radioType == "newloan"){
      const res = await apiFunction(endPointURLs.getNewLoanReports,"POST",{agent_id : values.id, month : month, year : year})
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
        Month Wise Reports
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
        <LabelAndInput value={values.selectDate} label={"Selected Date"} name={"selectDate"} type={"month"} onChangeHandler={onChangeHandler}/><br />
      </div>
      <br />
      <div style={{display:"flex",justifyContent:"center"}}>
        <div>
          <Button disabled={loading} className={'primary-btn'} onClick={onGenerate}>Generate</Button>
        </div>
      </div>
      <br />
      <LabelAndInput value={totAmount} label={'Total Amount'} disabled={true}/>
      <br />
      <div style={{display:"flex",justifyContent:"center"}}>
        <Button onClick={()=>exportToExcel(datas)}>To Excel</Button>
      </div>
    </div>
  )
}

export default MonthlyReports;