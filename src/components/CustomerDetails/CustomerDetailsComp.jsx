import React, { useEffect, useState } from "react";
import "./customerDetails.css";
import CustomerDetailsLeft from "./Left/CustomerDetailsLeft";
import CustomerDetailsRight from "./Right/CustomerDetailsRight";
import { apiFunction } from "../../Api/ApiFunction";
import { endPointURLs } from "../../Api/endPoints";
import SnackbarAlert from "../../common/Alert/SnackbarAlert/SnackBarAlert";
import PopUpAlert from "../../common/Alert/Popups/PopupAlert";
import BouncingDots from "../../common/Loader/BouncingDots";
import { onDeleteConfirmClick } from "./functions";
import { customerDetailsArr } from "./Left/customerDetailsArr";
import { getCredintials } from "../../utils/locatStorage/getCerditials";
import { useNavigate } from "react-router-dom";
import { path } from "../../router/Path";
import Delete from '@mui/icons-material/Delete';

const CustomerDetailsComp = () => {
  const [loading, setLoading] = useState(false);
  const [isError, setisError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDeleteAlert, setIsDeleteAlert] = useState(false);
  const [custDetailArrState, setCustDetailArrState] = useState(customerDetailsArr);
  const [afterMembers, setAfterMembers] = useState([]);
  const [datas, setDatas] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [viewCategory, setViewCategory] = useState("");

  const navigate = useNavigate();

  const [msg, setMsg] = useState("");
  const [values, setValues] = useState({
    noteId : "",
    emiId : "",
    agentId : "",
    agent: "",
    area: "",
    customerName: "",
    relativeName: "",
    contactNumber: "",
    place: "",
    category: "",
    loanAmount: "",
    balanceAmount: "",
    dateOfLoan: ""
  });
  const [buttons, setButtons] = useState([
    {
      name: "Add New",
      isDisable: false,
    },
    {
      name: "Update",
      isDisable: true,
    },
    {
      name: "Delete",
      isDisable: true,
    },
    {
      name: "Clear",
      isDisable: false,
    },
  ]);

  const onDeleteClick = () => {
    setIsDeleteAlert(true);
  };

  const onDeleteOk = ()=>{
    onDeleteConfirmClick({values : values, setValues : setValues, setLoading : setLoading, setMsg : setMsg, setIsSuccess : setIsSuccess, setisError : setisError, buttons : buttons, setButtons : setButtons})
    setIsDeleteAlert(false);
  };

  useEffect(()=>{
    const openFun = async()=>{
      setLoading(true)
      const isSuperAdmin = getCredintials().isSuperAdmin;
      if(isSuperAdmin !== "true"){
        const res = await apiFunction(endPointURLs.getParticularAgent,"POST",{email_id : getCredintials().email});
        if(res.data.message == "success"){
          if(res.data.data.length){
            setValues(prev => ({...prev, agentId : res.data.data[0]['id'], agent : res.data.data[0]['Agent Name']}));
          }
        }
      }
      setLoading(false);
    }
    openFun();
  },[])

  return (
    <>
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
      {isDeleteAlert && (
        <PopUpAlert
          okOnClick={onDeleteOk}
          open={isDeleteAlert}
          setOpen={setIsDeleteAlert}
          message={`Are You Sure to Delete '${values.customerName}'`}
        />
      )}
      {!loading ? (
        <div className="left-right-conatiner">
          <CustomerDetailsLeft viewCategory={viewCategory} setViewCategory={setViewCategory} hasMore={hasMore} setHasMore={setHasMore} datas={datas} setDatas={setDatas} afterMembers={afterMembers} setAfterMembers={setAfterMembers} custDetailArrState={custDetailArrState} setCustDetailArrState={setCustDetailArrState} onDeleteClick={onDeleteClick} setIsSuccess={setIsSuccess} setisError={setisError} setMsg={setMsg} loading={loading} setLoading={setLoading} values={values} setValues={setValues} buttons={buttons} setButtons={setButtons} />

          <CustomerDetailsRight viewCategory={viewCategory} setViewCategory={setViewCategory} hasMore={hasMore} setHasMore={setHasMore} datas={datas} setDatas={setDatas} afterMembers={afterMembers} setAfterMembers={setAfterMembers} custDetailArrState={custDetailArrState} setCustDetailArrState={setCustDetailArrState} values={values} setValues={setValues} buttons={buttons} setButtons={setButtons}/>
          <div style={{position:"absolute",right:"2vw",cursor:"pointer",display:"flex",color:"var(--secondary)"}} onClick={()=>navigate(path.trashMembers)}>
            <Delete/>
            <p>Trash</p>
          </div>
        </div>
      ) : (
        <BouncingDots />
      )}
    </>
  );
};

export default CustomerDetailsComp;