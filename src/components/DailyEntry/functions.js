import { apiFunction } from "../../Api/ApiFunction";
import { endPointURLs } from "../../Api/endPoints";
import { getCurrentMonth } from "../../utils/dateFunctions/dateFunctions";
import { getCredintials } from "../../utils/locatStorage/getCerditials";

export const getMonthSelection = async({values={}, setValues=()=>{}, setLoading=()=>{}, setMsg=()=>{}, setIsSuccess=()=>{}, setisError=()=>{}, tableDatas=[], setTableDatas = ()=>{}, orginallDatas=[], setorginallDatas=()=>{}})=>{
    setLoading(true);
    const keys = Object.keys(values);
    let isEmpty = keys.find((val) => values[val] === '' || values[val] === null || values[val] === undefined);
    if(isEmpty){
        alert('Fill All Values')
        setLoading(false)
        return;
    }
    let month = null;
    let year = null;
    if(values.month){
        let yearAndMonth = values.month.split('-');
        year = yearAndMonth[0]
        month = yearAndMonth[1]
    }
    try {
      const onGenerate = await apiFunction(
        endPointURLs.getPayments,
        "POST",
        {
            month: month,
            year: year,
            agent_id: values.agentId !== null && values.agentId !== undefined ? values.agentId : 0,
            collector_id: values.collectorId !== null && values.collectorId !== undefined ? values.collectorId : 0
        }
      );
      if(onGenerate?.data?.message === "success"){
          let data = onGenerate.data.data || [];
          console.log("GET_PAYMENTS_RESPONSE:", data);
          setTableDatas(data);
          setorginallDatas(data);
      }
    } catch(err) {
      console.error("Error in getMonthSelection:", err);
    } finally {
      setLoading(false);
    }
}

export const insertPaymentsHandler = async({values={}, setValues=()=>{}, setLoading=()=>{}, setMsg=()=>{}, setIsSuccess=()=>{}, setisError=()=>{}, tableDatas=[], setTableDatas = ()=>{}, orginallDatas=[], setorginallDatas=()=>{}, setIsConfirmSave = ()=>{}})=>{
    if(values.agentId){
        const keys = Object.keys(values);
        let isEmpty = keys.find((val)=>values[val]=='')
        if(isEmpty){
            alert('Fill All Values')
            setLoading(false)
            return;
        }
        setLoading(true);
        let changedInputs = [];
        let collecterId = values.collectorId;

        const changedDate = new Date();
        let formattedChangedDate = changedDate.toISOString().split('T')[0];

        if(tableDatas[0] && tableDatas[0]['hideLastPayDate']){
            const nxtDate = new Date(tableDatas[0]['hideLastPayDate']);
            nxtDate.setDate(nxtDate.getDate() + 1); // Add one day
            formattedChangedDate = nxtDate.toISOString().split('T')[0];
        }

        // console.log(formattedChangedDate);
        
        let isChanged = tableDatas.find((val)=>val[formattedChangedDate]['date'] != 0 || val[formattedChangedDate]['date'] != "");

        // console.log(isChanged);
        if(isChanged){
            tableDatas.forEach((val,ind)=>{
                if(ind != tableDatas.length-1){
                    if(val['hideLastPayDate']){
                        changedInputs.push(
                            {
                                emi_id : val['hideEmiId'],
                                agent_id : val['hideAgentId'],
                                member_id : val['hideMemberId'],
                                collector_id : collecterId ? collecterId : val['hideAgentId'],
                                amount : val[formattedChangedDate]['date'],
                                is_not_paid : (!val[formattedChangedDate]['date'] || val[formattedChangedDate]['date'] == 0) ? 1 : 0,
                                date : formattedChangedDate
                            }
                        )
                    }
                    else{
                        changedInputs.push(
                            {
                                emi_id : val['hideEmiId'],
                                agent_id : val['hideAgentId'],
                                member_id : val['hideMemberId'],
                                collector_id : collecterId ? collecterId : val['hideAgentId'],
                                amount : val[formattedChangedDate]['date'],
                                is_not_paid : (!val[formattedChangedDate]['date'] || val[formattedChangedDate]['date'] == 0) ? 1 : 0,
                                date : formattedChangedDate
                            }
                        )
                    }
                }     
            })
            const res = await apiFunction(endPointURLs.insertPayments,"POST",changedInputs);
            if(res.data.message == "Successfully Registered"){
                setIsSuccess(true);
            }
            else{
                setisError(true)
            }
            setMsg(res.data.message);
            let email = localStorage.getItem('user_id');
        // let agentId = 0;
        // const getAgent = await apiFunction(endPointURLs.getParticularAgent,"POST",{email_id : email})
        // if(getAgent.data.message == "success"){
        // agentId = getAgent.data.data[0]['id'];
        // }
        let month = null;
        let year = null;
        if(values.month){
            let yearAndMonth = values.month.split('-');
            year = yearAndMonth[0]
            month = yearAndMonth[1]
        }
        const res1 = await apiFunction(endPointURLs.getPayments, "POST", {agent_id : values.agentId, month : month, year : year})
        if(res1.data.message == "success"){
        setTableDatas(res1.data.data);
        setorginallDatas(res1.data.data);
        }
        }
        else{
            setisError(true)
            setMsg('Change Anything to Submit');
        }
    }
    else{
        alert(`Currently Can't do it with All`)
    }
    setIsConfirmSave(false);
    setLoading(false);
}