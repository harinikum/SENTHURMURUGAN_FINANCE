import React, { useEffect, useState } from 'react'
import LabelAndInput from '../../../common/Form/LabeAndSelect.jsx/LabelAndInput'
import { customerDetailsArr } from './customerDetailsArr'
import Button from '../../../common/Form/Buttton/Button'
import { endPointURLs } from '../../../Api/endPoints'
import { apiFunction } from '../../../Api/ApiFunction'
import { onClearClick } from '../../../utils/Forms/formFunctions'
import { onAddNewSubmitHandler, onUpdateSubmitHandler } from '../functions'
import LabelAndInputSugg from '../../../common/Form/LabeAndSelect.jsx/LabelAndInputSugg'
import { tableFectchApi } from '../../../utils/TableFunctions/tableFetchApi'
import { getCredintials } from '../../../utils/locatStorage/getCerditials'
import { downloadPDF } from '../../../utils/Pdf/pdfDownload'
import { getCategoryRange } from '../../../common/utils/categoryUtils'

const CustomerDetailsLeft = ({custDetailArrState, setCustDetailArrState, afterMembers, setAfterMembers,loading,setLoading=()=>{},values = {},setValues = () => {},buttons = [],setButtons = () => {},setMsg = ()=>{},setIsSuccess = ()=>{},setisError=()=>{},onDeleteClick=()=>{}, datas, setDatas, setHasMore}) => {

  const [areas, setAreas] = useState([]);
  const [agents, setAgents] = useState([]);

  const [downloadLoad, setDownloadLoad] = useState(false);
  // const [afterMembers, setAfterMembers] = useState([]);
  // const [custDetailArrState, setCustDetailArrState] = useState(customerDetailsArr);

  const openFun = async()=>{
    const agentApi = await apiFunction(endPointURLs.getAgentNamesAndAreas,"POST",{search_term : values.area})
    const isSuperAdmin = getCredintials().isSuperAdmin;
    // if(isSuperAdmin && isSuperAdmin == "true"){
    if(agentApi.data.message == "success"){
      if(isSuperAdmin && isSuperAdmin == "true"){
        setAgents(agentApi.data.data)
      }
      setAreas(agentApi.data.data.map((val)=>val.area))
    }
    // const areaApi = await apiFunction(endPointURLs.getAreas,"POST",{search_term : values.agent,limit : 10})
    // if(areaApi.data.message == "success"){
    //   setAreas(areaApi.data.data.map((val)=>val.area))
    // }
  }

  useEffect(()=>{
    openFun();
  },[])

  const onAgentChange = async(e)=>{
    const isSuperAdmin = getCredintials().isSuperAdmin;
    if(isSuperAdmin && isSuperAdmin == "true"){
      let value = e.target.value;
      let name = e.target.name;

      let isExists = agents.find((val)=> val.name && val.name.toString().trim().toLowerCase() === (value || "").toString().trim().toLowerCase());
      
      if(isExists){
        const afterApi = await apiFunction(endPointURLs.getAfterMembers,"POST",{agent_id : isExists.id});
        if(afterApi.data.message == "success"){
          setCustDetailArrState(custDetailArrState.map((val)=>val.name == "addAfter" ? {...val,dataList : afterApi.data.data.map((val)=>val['Customer Name'])} : val));
          setAfterMembers(afterApi.data.data);
        }
        setValues(prev => ({...prev, [name] : value, agentId : isExists.id}));
      }
      else{
        setValues(prev => ({...prev, [name] : value}));
      }
    }
  }

  const areaOnChange = async(e)=>{
    let value = e.target.value;
    let name = e.target.name;
    
    // const areaApi = await apiFunction(endPointURLs.getAgentNamesAndAreas,"POST",{search_term : value,limit : 10, search_field : "area"})
    // if(areaApi.data.message == "success"){
    //   setAreas(areaApi.data.data.map((val)=>val.area))
    //   // let isExists = areaApi.data.data.find((val)=>val.area.toLowerCase() == value.toLowerCase())
    //   // if(isExists){
    //   //   setValues({...values, [name] : value, agent : isExists.name, agentId : isExists.id})
    //   // }
    //   // else{
    //     setValues({...values,[name] : value})
    //   // }
    // }
    // else{
      setValues({...values,[name] : value})
    // }
  }

  const onChangeHandler = (e)=>{
    let name = e.target.name;
    let value = e.target.value;
    if(name!="addAfter"){
      setValues({...values, [name] : value});
    }
    else{
      setValues({...values, [name] : value});
      // console.log(afterMembers);
      
      let isExists = afterMembers.find((val)=>val['Customer Name'].toLowerCase() == value.toLowerCase())
      // console.log(isExists);
      
      if(isExists){
        setValues({...values, [name] : isExists});
      }
      else{
        // setValues(prevValues=>({...prevValues, prevValues[name] : {'Customer Name' : value}}))
        setValues({...values, [name] : {'Customer Name' : value}});
      }
    }
  }
  const onSubmitHandler = (e) => {
    e.preventDefault();
    let submitType = buttons.find((val) => !val.isDisable);
    const cat = (values.category || '').toString().trim().toUpperCase();
    const noteNum = Number(values.noteId);

    if (!cat) {
      alert("Please select a Category");
      return;
    }
    const range = getCategoryRange(cat);
    if (range && (noteNum < range.min || noteNum > range.max)) {
      alert(`Category ${cat} Customer Number must be between ${range.min} and ${range.max}`);
      return;
    }

    if((Number(values.loanAmount)>=Number(values.balanceAmount) && Number(values.loanAmount > 100))){
      if(submitType.name == "Add New"){
        onAddNewSubmitHandler({values : {...values, category: cat}, setValues : setValues, setLoading : setLoading, setMsg : setMsg, setIsSuccess : setIsSuccess, setisError : setisError, setAfterMembers : setAfterMembers, setCustDetailArrState : setCustDetailArrState, custDetailArrState : custDetailArrState})
      }
      else if(submitType.name == "Update"){
        onUpdateSubmitHandler({values : {...values, category: cat}, setValues : setValues, setLoading : setLoading, setMsg : setMsg, setIsSuccess : setIsSuccess, setisError : setisError,buttons : buttons, setButtons : setButtons})
      }
    }
    else{
      alert("Give proper loan and balance amount");
    }

    // console.log(submitType)
    // submitType.onClick(values);
  };

  const onDownloadClick = async()=>{
    setDownloadLoad(true)
    const res = await apiFunction(endPointURLs.getMembers,"POST",{agent_email : getCredintials().email});
    if(res.data.message == "success"){
      if(res.data.data && res.data.data.length > 0){
        let agentName = `Agent Name : ${res.data.data[0]['Agent Name']}`
        downloadPDF({data : res.data.data,name : agentName})
      }
    }
    setDownloadLoad(false)
    // downloadPDF({data : datas, setLoading : setDownloadLoad, url : endPointURLs.getMembers,payload : {is_blocked : 0}, name : 'Customer Datas'})
  }
  return (
    <div className='form-left-container'>
      <form className="left-form" onSubmit={onSubmitHandler}>
        <div className='customer-details-form-flex'>
          <LabelAndInputSugg name={'agent'} label={'Agent'} dataList={agents} setDataList={setAgents} id={'agent'} listName={'AgeNt'} onChangeHandler={onAgentChange} value={values['agent']}/>
          <LabelAndInput name={'area'} label={'Area'} dataList={areas} id={'area'} listName={'ArEa'} onChangeHandler={areaOnChange} value={values['area']}/>
        </div>
        <br />
        {
          custDetailArrState.map((val,ind)=><><LabelAndInput key={ind} label={val.label} id={val.name} required={val.required} name={val.name} type={val.type} listName={val.listName} dataList={val.dataList} onChangeHandler={onChangeHandler} value={values[val.name]} /> <br /></>)
        }
        <div className='btns-div'>
          {buttons.map(
              (btn, ind) =>
                !btn.isDisable && (
                  <Button
                    key={ind}
                    className={"primary-btn"}
                    type={
                      btn.name == "Update" || btn.name == "Add New"
                        ? "submit"
                        : "button"
                    }
                    onClick={
                        btn.name == "Delete"
                        ? () => onDeleteClick()
                        : (btn.name == 'Clear') ? () => onClearClick(values, setValues, buttons, setButtons) : undefined
                    }
                  >
                    {btn.name}
                  </Button>
                )
          )}
        </div>
        <Button className={"primary-btn"} type='button' onClick={onDownloadClick} disabled={downloadLoad}>Download as PDF</Button>
      </form>
    </div>
  )
}

export default CustomerDetailsLeft