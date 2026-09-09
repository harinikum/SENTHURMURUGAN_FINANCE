import React, { useState } from "react";
import CustomerTrashRight from "./Right/CustomerTrashRight";
import CustomerTrashLeft from "./Left/CustomerTrashLeft";
import SnackbarAlert from "../../../common/Alert/SnackbarAlert/SnackBarAlert";
import { apiFunction } from "../../../Api/ApiFunction";
import { endPointURLs } from "../../../Api/endPoints";

const CustomerTrashDetails = () => {
  const [values, setValues] = useState(
    {
      id : "",
      customerName: "",
      contactNumber : "",
      aadharNumber : "",
      panNumber : ""
    }
  )
  const [datas, setDatas] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setisError] = useState(false);
  const [msg, setMsg] = useState("");

  const onRecoverClick = async()=>{
    if(values.id){
      const res = await apiFunction(endPointURLs.restoreMember,"POST",{id : values.id})
      if(res.data.message == "Successfully Restored"){
        setIsSuccess(true);
        let tempObj = {};
        let keys = Object.keys(values);
        keys.forEach((val)=>{
          tempObj[val] = ""
        })
        const filters = {
          // "search_term" : searchInp,
          "limit" : 12,
          "offset" : 0,
        }
        const res = await apiFunction(endPointURLs.getDeletedMembers,"POST",filters)
        if(res.data.message == "success"){
          setDatas(res.data.data)
        }
        setValues(tempObj)
      }
      else{
        setisError(true)
      }
      setMsg(res.data.message)
    }
    else{
      alert('Fill All Values');
    }
  }
  return (
    <div className="left-right-conatiner">
      {isSuccess && (
        <SnackbarAlert open={isSuccess} setOpen={setIsSuccess} message={msg} />
      )}
      {isError && (
        <SnackbarAlert
          open={isError}
          setOpen={setisError}
          severity="error"
          message={msg}
        />
      )}
      <CustomerTrashLeft
        values={values}
        setValues={setValues}
        onRecoverClick={onRecoverClick}
      />

      <CustomerTrashRight
        hasMore={hasMore}
        setHasMore={setHasMore}
        datas={datas}
        setDatas={setDatas}
        values={values}
        setValues={setValues}
      />
    </div>
  );
};

export default CustomerTrashDetails;
