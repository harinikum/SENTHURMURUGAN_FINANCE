import React from 'react'
import Button from '../../../common/Form/Buttton/Button'
import { addEmiArr } from './addEmiArr'
import LabelAndInput from '../../../common/Form/LabeAndSelect.jsx/LabelAndInput'
import { apiFunction } from '../../../Api/ApiFunction'
import { endPointURLs } from '../../../Api/endPoints'

const AddEmiLeft = ({loading, setLoading=()=>{},values = {},setValues = () => {},buttons = [],setButtons = () => {},setMsg = ()=>{},setIsSuccess = ()=>{},setisError=()=>{}, datas, setDatas, setHasMore}) => {
    const onChangeHandler = (e)=>{
        const name = e.target.name;
        const value = e.target.value;
        if(name != "customerName" && name!= "contactNumber"){
            setValues({...values, [name] : value});
        }
    }
    const onSubmitHandler = async(e)=>{
        e.preventDefault();
        if((Number(values.loanAmount)>=Number(values.balanceAmount) && Number(values.loanAmount > 100))){
          setLoading(true)
          try{
              const res = await apiFunction(endPointURLs.insertEmi,"POST",{agent_id : values.agentId, place : values.place,loan_amount : values.loanAmount,balance_amount : values.balanceAmount, date_of_loan : values.dateOfLoan, note_id : values.noteId, emi_amount : values.emiAmount, id : values.id, area : values.area });
              if(res.data.message == "Successfully Added"){
                  setIsSuccess(true)
                  setValues({agentId : values.agentId})
                  setMsg("Successfully Added")
              }
              else{
                  setisError(true);
                  setMsg(res.data.message);
              }
          }
          catch(err){
              setisError(true);
              setMsg(err);
          }
          setLoading(false);
        }
        else{
          alert("Enter Proper Values")
        }
    }
  return (
    <div className='form-left-container'>
      <form className="left-form" onSubmit={onSubmitHandler}>
        {
          addEmiArr.map((val,ind)=><><LabelAndInput key={ind} label={val.label} id={val.name} required={val.required} name={val.name} type={val.type} listName={val.listName} dataList={val.dataList} onChangeHandler={onChangeHandler} value={values[val.name]} /> <br /></>)
        }
        <Button className={"primary-btn"} type='submit'>Add New</Button>
      </form>
    </div>
  )
}

export default AddEmiLeft