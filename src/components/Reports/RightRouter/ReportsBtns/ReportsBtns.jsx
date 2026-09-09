import React from "react";

const ReportsBtns = ({ btns = [], clicked, setClicked }) => {
  return (
    <div className="two-btns">
      {btns.map((val, ind) => (
        <div key={ind} className={clicked == val.path ? "report-btn-selected" : "report-btn"} onClick={()=>setClicked(val.path)}>{val.title}</div>
      ))}
    </div>
  );
};

export default ReportsBtns;