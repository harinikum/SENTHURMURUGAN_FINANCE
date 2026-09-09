import { apiFunction } from "../../Api/ApiFunction";
import { endPointURLs } from "../../Api/endPoints";

export const onAddNewSubmitHandler = async({values={}, setValues=()=>{}, setLoading, setMsg, setIsSuccess, setisError, setAfterMembers, setCustDetailArrState, custDetailArrState})=>{
    setLoading(true);
    const payload = { agent_id : values.agentId, name : values.customerName, relative_name : values.relativeName, order_num : values.addAfter && values.addAfter.orderNumber && Number(values.addAfter.orderNumber), place : values.place, category : values.category, contact_no : values.contactNumber,loan_amount : values.loanAmount,balance_amount : values.balanceAmount, date_of_loan : values.dateOfLoan, aadhar_no : values.aadharNo, pan_no: values.panNumber, area : values.area, description : values.description, note_id : values.noteId, emi_amount : values.emiAmount};
    console.log("***** insertMember payload *****", payload);
    const res = await apiFunction(endPointURLs.insertMember,"POST", payload);
    if(res.data.message == "Successfully Added"){
        setIsSuccess(true);
        const keys = Object.keys(values);
        let tempObj = {};
        keys.forEach((key)=>{
            tempObj[key] = ""
        });
        const afterApi = await apiFunction(endPointURLs.getAfterMembers,"POST",{agent_id : values.agentId});
          if(afterApi.data.message == "success"){
            setCustDetailArrState(custDetailArrState.map((val)=>val.name == "addAfter" ? {...val,dataList : afterApi.data.data.map((val)=>val['Customer Name'])} : val));
            setAfterMembers(afterApi.data.data);
          }
        setValues({...tempObj,agentId : values.agentId,agent : values.agent});
    }
    else{
        setisError(true);
    }
    setMsg(res.data.message);
    
    setLoading(false);
}

export const onUpdateSubmitHandler = async({values={}, setValues=()=>{}, setLoading, setMsg, setIsSuccess, setisError, buttons={}, setButtons=()=>{}})=>{
    setLoading(true);
    const payload = { agent_id : values.agentId, name : values.customerName, relative_name : values.relativeName, order_num : values.addAfter && values.addAfter.orderNumber && Number(values.addAfter.orderNumber), place : values.place, category : values.category, contact_no : values.contactNumber,loan_amount : values.loanAmount, balance_amount : values.balanceAmount, date_of_loan : values.dateOfLoan, aadhar_no : values.aadharNo, pan_no: values.panNumber, area : values.area, id : values.emiId, description: values.description, note_id : values.noteId, emi_amount : values.emiAmount};
    console.log("***** updateMember payload *****", payload);
    const res = await apiFunction(endPointURLs.updateMember,"POST", payload);
    if(res.data.message == "Successfully Updated"){
        setIsSuccess(true);
        const keys = Object.keys(values);
        let tempObj = {};
        keys.forEach((key)=>{
            tempObj[key] = ""
        });
        setValues({...tempObj,agentId : values.agentId,agent : values.agent});
        setButtons(buttons.map((btn)=> btn.name == "Add New" || btn.name == "Clear" ? {...btn,isDisable : false} : {...btn, isDisable : true}));
    }
    else{
        setisError(true);
    }
    setMsg(res.data.message);

    setLoading(false);
}

export const onDeleteConfirmClick = async({values={}, setValues=()=>{}, setLoading, setMsg, setIsSuccess, setisError, buttons=[], setButtons})=>{
    setLoading(true);
    const res = await apiFunction(endPointURLs.deleteMember,"POST",{id : values.id });
    if(res.data.message == "Successfully Deleted"){
        setIsSuccess(true);
    }
    else{
        setisError(true);
    }
    setMsg(res.data.message);
    
    const keys = Object.keys(values);
    let tempObj = {};
    keys.forEach((key)=>{
        tempObj[key] = ""
    });


    const btnKeys = Object.keys(values);
    let btnTempObj = {};
    btnKeys.forEach((key)=>{
        btnTempObj[key] = ""
    });
    setButtons(buttons.map((btn)=> btn.name == "Add New" || btn.name == "Clear" ? {...btn,isDisable : false} : {...btn, isDisable : true}))

    // setValues(btnTempObj);
    setValues({...tempObj,agentId : values.agentId,agent : values.agent});
    setLoading(false);
}