import React, { useEffect, useState } from 'react'
import './dailyLeft.css'
import Select from '../../../../common/Form/Select/Select'
import Button from '../../../../common/Form/Buttton/Button'
import Input from '../../../../common/Form/Input/Input'
import LabelAndInput from '../../../../common/Form/LabeAndSelect.jsx/LabelAndInput'
import { apiFunction } from '../../../../Api/ApiFunction'
import { endPointURLs } from '../../../../Api/endPoints'
import LabelAndInputSugg from '../../../../common/Form/LabeAndSelect.jsx/LabelAndInputSugg'
import { getCredintials } from '../../../../utils/locatStorage/getCerditials'

const DailyEntryLeft = ({values={}, setValues=()=>{}, onGetMonthSelection=()=>{}, onCloseClick=()=>{},onPaymentRegister = ()=>{}, loading, setLoading=()=>{}, setIsConfirmSave=()=>{}, onExportToExcel=()=>{},onPdfGenerate=()=>{}}) => {
  const [agents, setAgents] = useState([]);
  const [collectors, setCollectors] = useState([]);
  const openFun = async()=>{
    const res = await apiFunction(endPointURLs.getAgentNamesAndAreas,"POST");
    if(res.data.message == "success"){
      const agentsDatalists = [{id : 0, name : "All", area : ""}, ...res.data.data];
      setAgents(agentsDatalists);
      setCollectors(agentsDatalists);
    }
  }
  useEffect(()=>{
    openFun();
  },[])

  const onChangeHandler = (e)=>{
    let value = e.target.value;
    let name = e.target.name;
    
    if(name == "agent"){
      if(!value || value.toLowerCase() === "all"){
        setValues((prev) => ({ ...prev, agent: value, agentId: 0 }));
        return;
      }
      let isExists = agents.find((val)=>val.name.toLowerCase() == value.toLowerCase());
      if(isExists){
        setValues((prev) => ({...prev, [name] : value, agentId : isExists.id}));
      }
      else{
        setValues((prev) => ({...prev, [name] : value, agentId : null}));
      }
    }
    else if(name == "collectorName"){
      if(!value || value.toLowerCase() === "all"){
        setValues((prev) => ({ ...prev, collectorName: value, collectorId: 0 }));
        return;
      }
      let isExists = agents.find((val)=>val.name.toLowerCase() == value.toLowerCase());
      if(isExists){
        setValues((prev) => ({...prev, [name] : value, collectorId : isExists.id}));
      }
      else{
        setValues((prev) => ({...prev, [name] : value, collectorId : null}));
      }
    }
    else {
      setValues((prev) => ({...prev, [name] : value}));
    }
  }

  const onSubmitHandler = (e)=>{
    e.preventDefault();
  }

  // const onSuggesstionClick = (name,value)=>{
  //   setValues({...values, [name] : value});
  // }

  return (
    <div className='daily-entry-left'>
      <form className="daily-entry-form" onSubmit={onSubmitHandler}>
        <LabelAndInputSugg required={true} name={'agent'} label={'Select Agent'} id={'selectagent'} listName={'SelectAgent'} dataList={agents} setDataList={setAgents} value={values['agent']} onChangeHandler={onChangeHandler}/>
        <br />
        <LabelAndInputSugg required={true} name={'collectorName'} value={values['collectorName']} label={'Collector Name'} id={'selectcollector'} listName={'SelectCollector'} dataList={collectors} setDataList={setCollectors} onChangeHandler={onChangeHandler}/>
        <br />
        <div>
          <p>Month Selection</p>
          <div style={{display:"flex"}}>
            <Input required={true} type="month" name='month' onChange={onChangeHandler} value={values['month']}/> &nbsp;
            <div style={{display:"flex",gap:"2px"}}>
              <Button className={'primary-btn'} type='button' onClick={onGetMonthSelection}>View</Button>
              <Button className={'primary-btn'} type='button' onClick={onExportToExcel}>Excel</Button>
            </div>
          </div>
          <div className="three-btn-div-container">
            <div className="thre-btn-div">
              <div className="first-two-btn">
                <Button className={'primary-btn'} type='button' onClick={onGetMonthSelection}>Refresh</Button>
                <Button className={'primary-btn'} type='button' onClick={onCloseClick}>Close</Button>
              </div>
              <div className="third-btn">
                <Button disabled={loading} className={'primary-btn'} type='button' onClick={()=>setIsConfirmSave(true)}>Save Changes</Button>
              </div>
              {/* <div className="third-btn">
                <Button disabled={loading} className={'primary-btn'} type='button' onClick={onPdfGenerate}>PDF Generate</Button>
              </div> */}
            </div>
          </div>
        </div>
      </form>

      <div className="notes-daily-entry">
        <p>Note : </p>
        <p>Put SA for account starts</p>
        {/* <p>Put AC for closing account</p> */}
      </div>
    </div>
  )
}

export default DailyEntryLeft