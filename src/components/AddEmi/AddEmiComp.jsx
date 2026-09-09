import React, { useEffect, useState } from 'react'
import AddEmiLeft from './Left/AddEmiLeft'
import AddEmiRight from './Right/AddEmiRight'
import { useNavigate } from 'react-router-dom';
import { apiFunction } from '../../Api/ApiFunction';
import { endPointURLs } from '../../Api/endPoints';
import { getCredintials } from '../../utils/locatStorage/getCerditials';
import SnackbarAlert from '../../common/Alert/SnackbarAlert/SnackBarAlert';
import BouncingDots from '../../common/Loader/BouncingDots';

const AddEmiComp = () => {
  const [loading, setLoading] = useState(false);
  const [isError, setisError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [afterMembers, setAfterMembers] = useState([]);
  const [datas, setDatas] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const navigate = useNavigate();
  const [msg, setMsg] = useState("");
  const [values, setValues] = useState({});

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
      {!loading ?
        <div className="left-right-conatiner">
          <AddEmiLeft hasMore={hasMore} setHasMore={setHasMore} datas={datas} setDatas={setDatas} setIsSuccess={setIsSuccess} setisError={setisError} setMsg={setMsg} loading={loading} setLoading={setLoading} values={values} setValues={setValues}/>
          <AddEmiRight hasMore={hasMore} setHasMore={setHasMore} datas={datas} setDatas={setDatas} values={values} setValues={setValues}/>
        </div>
        : <BouncingDots/>
      }
    </>
  )
}

export default AddEmiComp