import React, { useEffect, useState } from "react";
import { apiFunction } from "../../../Api/ApiFunction";
import { endPointURLs } from "../../../Api/endPoints";
import NormalTable from "../../../common/Table/NormalTable";
import BouncingDots from "../../../common/Loader/BouncingDots";

const ChangePassRight = ({values, setValues, selectedRow, setSelectedRow}) => {
  const [datas, setDatas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState("");

  const openFun = async () => {
    // setLoading(true);
    const res = await apiFunction(endPointURLs.getAgentNames, "POST", {search_term : value});
    if (res.data.message == "success") {
      setDatas(res.data.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    openFun();
  }, [value]);

  const searchOnChange = (e)=>{
    setValue(e.target.value);
  }

  const onTableClick = (row)=>{
    setValues({...values, email : row['Email ID'], password : '', id : row['id']});
    setSelectedRow(row);
  }
  return (
    <div className="table-right">
      {!loading ? (
        // <TableCo
        <div className="table-container-div-par">
          <div className="table-container-heading">
            <p className="entry-form-title">{"Agent Change Password"}</p>
            <input type="text" value={value} onChange={searchOnChange} />
          </div>
          <div className="table-container-body">
            <NormalTable selectedRow={selectedRow} tableDatas={datas} onClick={onTableClick}/>
          </div>
        </div>
      ) : (
        <BouncingDots />
      )}
    </div>
  );
};

export default ChangePassRight;
