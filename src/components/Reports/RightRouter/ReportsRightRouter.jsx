import React, { useState } from "react";
import ReportsLayout from "./ReportsLayout";
import DailyReports from "./DailyReports.jsx/DailyReports";
import { path } from "../../../router/Path";
import MonthlyReports from "./monthlyReports/MonthlyReports";
import CollectionReports from "./CollectionReports/CollectionReports";
import CustomerReports from "./CustomerReports/CustomerReports";

const ReportsRightRouter = ({datas,setDatas, loading, setLoading}) => {
  const [clicked, setClicked] = useState("day_wise");
  return (
    <div className="reports-right">
      <ReportsLayout clicked={clicked} setClicked={setClicked} />
      {clicked == "day_wise" ? (
        <DailyReports loading={loading} setLoading={setLoading} datas={datas} setDatas={setDatas}/>
      ) : clicked == "month_wise" ? (
        <MonthlyReports loading={loading} setLoading={setLoading} datas={datas} setDatas={setDatas}/>
      ) : clicked == "collection_wise" ? (
        <CollectionReports loading={loading} setLoading={setLoading} datas={datas} setDatas={setDatas} />
      ) : (
        <CustomerReports loading={loading} setLoading={setLoading} datas={datas} setDatas={setDatas}/>
      )}
    </div>
  );
};

export default ReportsRightRouter;
