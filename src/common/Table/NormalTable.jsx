import React, { useEffect, useState } from "react";
import "./Table.css";
import { dummyEmiDatas } from "./dummyDatas";
import { changeDateYYMMDD } from "../../utils/dateFunctions/dateFunctions";
import { Delete } from '@mui/icons-material';

function NormalTable({ tableDatas = dummyEmiDatas, loading, selectedRow = {}, onClick = () => {}, hideColumns = [], onDeleteClick}) {
  const [headings, setHeadings] = useState([]);

  useEffect(()=>{
    setHeadings(tableDatas && tableDatas.length > 0 ? Object.keys(tableDatas[0]) : [])
  },[tableDatas])

  return (
    // <div className="table-container">
    <table className="table">
      <thead>
        <tr>
          {headings.map((heading, index) => (
            (!heading.includes('hide') && !hideColumns.includes(heading)) && (
              <th className={`table-th`} key={index}>
                {heading === "id" ? "Sno" : heading}
              </th>
            )
          ))}
          {onDeleteClick && (
            <th className={`table-th`}>Action</th>
          )}
        </tr>
      </thead>
      <tbody>
        {loading && <div className="table-body-load"></div>}
        {tableDatas.map((row, i) => (
          <tr
            className={selectedRow && selectedRow.id && selectedRow.id === row.id ? "selected-tr" : "body-tr"}
            key={i}
            onClick={() => onClick(row)}
          >
            {headings.map((heading, ind) => (
              (!heading.includes('hide') && !hideColumns.includes(heading)) && (
                <td key={ind} className={`table-td`}>
                  {heading === "id" && row[heading] !== "" ? i + 1 : (heading.toLowerCase() && heading.toLowerCase().includes('date')) ? changeDateYYMMDD(row[heading]) : row[heading]}
                </td>
              )
            ))}
            {onDeleteClick && (
              <td className={`table-td`} onClick={(e) => { e.stopPropagation(); onDeleteClick(row); }}>
                <Delete style={{ cursor: "pointer", color: "red" }} titleAccess="Delete" />
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>

  );
}

export default NormalTable;