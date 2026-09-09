import { apiFunction } from "../../Api/ApiFunction";
import { endPointURLs } from "../../Api/endPoints";

export const onAddNewSubmitHandler = async({values={}, setValues=()=>{}, setLoading, setMsg, setIsSuccess, setisError})=>{
    setLoading(true);
    const res = await apiFunction(endPointURLs.insertAgent,"POST",{name : values.agentName,area : values.area,aadhar_no : values.aadharNo, contact_no : values.contactNo, address : values.agentAddress, email_id : values.emailID, password : values.password });
    if(res.data.message == "Successfully Added"){
        setIsSuccess(true);
        const keys = Object.keys(values);
        let tempObj = {};
        keys.forEach((key)=>{
            tempObj[key] = ""
        });
        setValues(tempObj);
    }
    else{
        setisError(true);
    }
    setMsg(res.data.message);
    
    setLoading(false);
}

export const onUpdateSubmitHandler = async({values={}, setValues=()=>{}, setLoading, setMsg, setIsSuccess, setisError,buttons={}, setButtons=()=>{}})=>{
    setLoading(true);
    const res = await apiFunction(endPointURLs.updateAgent,"POST",{name : values.agentName,area : values.area,aadhar_no : values.aadharNo, contact_no : values.contactNo, address : values.agentAddress, id : values.id });
    if(res.data.message == "Successfully Updated"){
        setIsSuccess(true);
        const keys = Object.keys(values);
        let tempObj = {};
        keys.forEach((key)=>{
            tempObj[key] = ""
        });
        setValues(tempObj);
        setButtons(buttons.map((btn)=> btn.name == "Add New" || btn.name == "Clear" ? {...btn,isDisable : false} : {...btn, isDisable : true}));
    }
    else{
        setisError(true);
    }
    setMsg(res.data.message);
    setLoading(false);
}

export const onClearClick = (values, setValues, buttons, setButtons)=>{
    const keys = Object.keys(values);
    let tempObj = {};
    keys.forEach((key)=>{
        tempObj[key] = ""
    });
    setValues(tempObj);
    setButtons(buttons.map((btn)=> btn.name == "Add New" || btn.name == "Clear" ? {...btn,isDisable : false} : {...btn, isDisable : true}))
}

export const onDeleteConfirmClick = async({values={}, setValues=()=>{}, setLoading, setMsg, setIsSuccess, setisError, buttons=[], setButtons})=>{
    setLoading(true);
    const res = await apiFunction(endPointURLs.deleteAgent,"POST",{id : values.id });
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
    setValues(btnTempObj);
    setButtons(buttons.map((btn)=> btn.name == "Add New" || btn.name == "Clear" ? {...btn,isDisable : false} : {...btn, isDisable : true}))

    setValues(btnTempObj);
    setLoading(false);
}