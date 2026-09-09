import React, { useRef, useState } from "react";
import "./Table.css";
import { dummyEmiDatas } from "./dummyDatas";
import {
  changeDateFormat,
  changeDateYYMMDD,
  isValidDate,
} from "../../utils/dateFunctions/dateFunctions";
import Button from "../Form/Buttton/Button";
import { memberLookupById } from "../utils/memberLookup";
import SAPopUp from "../Alert/Popups/SAPopUp";
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CloseIcon from '@mui/icons-material/Close';

function DailyEntryTable({
  tableDatas = dummyEmiDatas,
  loading,
  onClick = () => { },
  setTableDatas = () => { },
  values = {},
  setValues = () => { },
  open = false,
  setOpen = () => { },
  setMsg = () => { },
}) {
    const headings = [
    "AGENT",
    "AREA",
    "உ.எண்",
    "CNAME",
    "LAMT",
    "DATE",
    "loan_end_date",
    ...Object.keys(tableDatas[0] || {}).filter(k => !["AGENT", "AREA", "user_unique_id", "CNAME", "LAMT", "DATE", "loan_end_date", "agent_name", "area", "customer_name", "loan_amount", "date_of_loan", "note_id", "உ.எண்", "END DATE"].includes(k))
    ];

  // Payment breakdown modal state
  const [paymentModal, setPaymentModal] = useState({ open: false, column: null, date: null });

  const inputRefs = useRef(
    tableDatas.map(() => headings.map(() => React.createRef()))
  );

  const fixedColumns = ["AGENT", "AREA", "உ.எண்", "CNAME", "LAMT", "DATE", "loan_end_date"];

  const columnLabels = {
    AGENT: "Agent",
    AREA: "Area",
    "உ.எண்": "உ.எண்",
    CNAME: "Customer Name",
    LAMT: "Loan Amount",
    DATE: "Start Date",
    loan_end_date: "Loan End Date"
  };

  const onTableChange = (column, row, value) => {
    if (value === "" || /^[0-9]+$/.test(value)) {
      if (!tableDatas[row]["hideLastPayDate"]) {
        const date = new Date();
        const formattedDate = date.toISOString().split("T")[0];
        if (formattedDate == column) {
          let datas = [...tableDatas];
          datas[row][column]["date"] = value;
          let tot = {};
          datas.forEach((val, ind) => {
            if (ind != datas.length - 1) {
              if (tot[column]) {
                tot[column] += Number(val[column]["date"]);
              } else {
                tot[column] = Number(val[column]["date"]);
              }
            }
          });
          datas[datas.length - 1] = {
            ...datas[datas.length - 1],
            [column]: { ...datas[datas.length - 1][column], date: tot[column] },
          };
          setTableDatas(datas);
        }
      } else {
        const nxtDate = new Date(tableDatas[row]["hideLastPayDate"]);
        nxtDate.setDate(nxtDate.getDate() + 1);
        const formattedNxtDate = nxtDate.toISOString().split("T")[0];
        if (formattedNxtDate == column) {
          let datas = [...tableDatas];
          datas[row][column]["date"] = value;
          let tot = {};
          datas.forEach((val, ind) => {
            if (ind != datas.length - 1) {
              if (tot[column]) {
                tot[column] += Number(val[column]["date"]);
              } else {
                tot[column] = Number(val[column]["date"]);
              }
            }
          });
          datas[datas.length - 1] = {
            ...datas[datas.length - 1],
            [column]: { ...datas[datas.length - 1][column], date: tot[column] },
          };
          setTableDatas(datas);
        }
      }
    } else if (
      ((value[0] == "S" && !value[1]) ||
        (value[0] == "S" && value[1] == "A")) &&
      value.length <= 2
    ) {
      if (!tableDatas[row]["hideLastPayDate"]) {
        const date = new Date();
        const formattedDate = date.toISOString().split("T")[0];
        if (formattedDate == column) {
          let datas = [...tableDatas];
          datas[row][column]["date"] = value;
          setTableDatas(datas);
        }
      } else {
        const nxtDate = new Date(tableDatas[row]["hideLastPayDate"]);
        nxtDate.setDate(nxtDate.getDate() + 1);
        const formattedNxtDate = nxtDate.toISOString().split("T")[0];
        if (formattedNxtDate == column) {
          let datas = [...tableDatas];
          datas[row][column]["date"] = value;
          setTableDatas(datas);
        }
      }
    }
  };

  const isDateEnded = (column, row) => {
    return tableDatas[row]["END DATE"] < column;
  };

  const handleKeyPress = (e, rowIndex, column, value, colIndex) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const direction = e.key === "ArrowUp" ? -1 : 1;
      const nextRow = rowIndex + direction;
      if (nextRow >= 0 && nextRow < tableDatas.length) {
        const ref = inputRefs.current[nextRow]?.[headings.indexOf(column)];
        if (ref?.current) {
          ref.current.focus();
        }
      }
    }
    else if (e.key === "Enter") {
      e.preventDefault();
      const direction = 1;
      const nextRow = rowIndex + direction;
      if (nextRow >= 0 && nextRow < tableDatas.length) {
        const ref = inputRefs.current[nextRow]?.[headings.indexOf(column)];
        if (ref?.current) {
          ref.current.focus();
        }
      }
    }
    else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const direction = e.key === "ArrowRight" ? 1 : -1;
      const nextCol = colIndex + direction;
      if (nextCol >= 0 && nextCol < headings.length) {
        const ref = inputRefs.current[rowIndex]?.[nextCol];
        if (ref?.current) {
          ref.current.focus();
        }
      }
    }
  };

  // Open payment breakdown modal for total row cell click
  const handleTotalCellClick = (column) => {
    const totalRowIndex = tableDatas.length - 1;
    const totalRow = tableDatas[totalRowIndex];
    if (!totalRow || !isValidDate(column)) return;
    const totalAmt = totalRow[column]?.date;
    if (!totalAmt || Number(totalAmt) === 0) return;
    setPaymentModal({ open: true, column: column, date: changeDateFormat(column) });
  };

  // Get payment breakdown for a specific day column
  const getPaymentBreakdown = (column) => {
    const totalRowIndex = tableDatas.length - 1;
    const rows = tableDatas.slice(0, totalRowIndex);
    const gpayUsers = [];
    const cashUsers = [];
    rows.forEach((row) => {
      const cell = row[column];
      if (cell && Number(cell.date) > 0) {
        const name = row["CNAME"] || row["customer_name"] || row["AGENT"] || "";
        const uid = row["user_unique_id"] || row.note_id || row["உ.எண்"] || row.hideNoteId || "";
        const amount = cell.date;
        const method = cell.payment_method;
        if (method === 'gpay') {
          gpayUsers.push({ name, uid, amount });
        } else if (method === 'cash') {
          cashUsers.push({ name, uid, amount });
        } else {
          // no method set, show under cash as default
          cashUsers.push({ name, uid, amount });
        }
      }
    });
    const gpayTotal = gpayUsers.reduce((sum, u) => sum + Number(u.amount), 0);
    const cashTotal = cashUsers.reduce((sum, u) => sum + Number(u.amount), 0);
    return { gpayUsers, cashUsers, gpayTotal, cashTotal };
  };

  const isTotalRow = (i) => i === tableDatas.length - 1;

  return (
    <>
      {/* Payment Breakdown Modal */}
      {paymentModal.open && (() => {
        const { gpayUsers, cashUsers, gpayTotal, cashTotal } = getPaymentBreakdown(paymentModal.column);
        return (
          <div className="pay-modal-overlay" onClick={() => setPaymentModal({ open: false, column: null, date: null })}>
            <div className="pay-modal-box" onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <div className="pay-modal-header">
                <div className="pay-modal-title">
                  <span className="pay-modal-date-badge">{paymentModal.date}</span>
                  <span>Payment Breakdown</span>
                </div>
                <button
                  className="pay-modal-close-btn"
                  onClick={() => setPaymentModal({ open: false, column: null, date: null })}
                  title="Close"
                >
                  <CloseIcon style={{ fontSize: '20px' }} />
                </button>
              </div>

              {/* Summary Cards */}
              <div className="pay-modal-summary">
                <div className="pay-summary-card pay-summary-gpay">
                  <PhoneAndroidIcon style={{ fontSize: '28px', color: '#1565c0' }} />
                  <div>
                    <div className="pay-summary-label">GPay Total</div>
                    <div className="pay-summary-amount">₹{gpayTotal}</div>
                  </div>
                </div>
                <div className="pay-summary-card pay-summary-cash">
                  <AttachMoneyIcon style={{ fontSize: '28px', color: '#2e7d32' }} />
                  <div>
                    <div className="pay-summary-label">Cash Total</div>
                    <div className="pay-summary-amount">₹{cashTotal}</div>
                  </div>
                </div>
              </div>

              {/* GPay Section */}
              {gpayUsers.length > 0 && (
                <div className="pay-modal-section">
                  <div className="pay-section-header pay-section-gpay-header">
                    <PhoneAndroidIcon style={{ fontSize: '16px' }} />
                    <span>GPay Payments ({gpayUsers.length})</span>
                  </div>
                  <table className="pay-breakdown-table">
                    <thead>
                      <tr>
                        <th>உ.எண் (ID)</th>
                        <th>Customer Name</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gpayUsers.map((u, idx) => (
                        <tr key={idx}>
                          <td>{u.uid}</td>
                          <td>{u.name}</td>
                          <td className="pay-amount-cell pay-gpay-amount">₹{u.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Cash Section */}
              {cashUsers.length > 0 && (
                <div className="pay-modal-section">
                  <div className="pay-section-header pay-section-cash-header">
                    <AttachMoneyIcon style={{ fontSize: '16px' }} />
                    <span>Cash Payments ({cashUsers.length})</span>
                  </div>
                  <table className="pay-breakdown-table">
                    <thead>
                      <tr>
                        <th>உ.எண் (ID)</th>
                        <th>Customer Name</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cashUsers.map((u, idx) => (
                        <tr key={idx}>
                          <td>{u.uid}</td>
                          <td>{u.name}</td>
                          <td className="pay-amount-cell pay-cash-amount">₹{u.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {gpayUsers.length === 0 && cashUsers.length === 0 && (
                <div className="pay-modal-empty">No payment details available for this day.</div>
              )}
            </div>
          </div>
        );
      })()}

      <table className="table">
        <thead>
          <tr>
            {headings.map(
              (heading, index) =>
                !heading.includes("hide") && (
                  <th
                    className={`table-th ${fixedColumns.includes(heading) ? "sticky-column" : ""}`}
                    key={index}
                    style={{ minWidth: heading === "உ.எண்" ? "90px" : (heading === "CNAME" || heading === "customer_name") ? "120px" : "auto" }}
                  >
                    {columnLabels[heading] || changeDateFormat(heading)}
                  </th>
                )
            )}
          </tr>
        </thead>
        <tbody>
          {loading && <div className="table-body-load"></div>}
                    {tableDatas.map((row, i) => {
                       console.log("Daily Entry Row:", row);
            return (
              <tr className="body-tr" key={i} onClick={() => {
                if (isTotalRow(i)) return; // Don't trigger member lookup for total row
                const memberId = row['hideMemberId'] || row['id'] || row['name'] || row['place'] || row['emi_id'] || '';
                memberLookupById(i, memberId, setTableDatas, setValues, values);
              }}>
                {headings.map((heading, ind) => {
                  if (heading.includes("hide")) return null;
                  if (heading === "உ.எண்") {
                    return (
                      <td
                        key={ind}
                        className={`table-td ${
                          fixedColumns.includes(heading)
                            ? "sticky-column-td"
                            : ""
                        }`}
                      >
                        {row["உ.எண்"] ?? row.note_id ?? row.user_unique_id ?? "-"}
                      </td>
                    );
                  }
                  // Render Loan End Date column
                  if (heading === "loan_end_date") {
                    return (
                      <td
                        key={ind}
                        className={`table-td ${fixedColumns.includes(heading) ? "sticky-column-td" : ""}`}
                      >
                        {row.loan_end_date ?? row["END DATE"] ?? row.hideEndDate}
                      </td>
                    );
                  }
                  // Render date columns in Total row — clickable
                  if (isTotalRow(i) && isValidDate(heading)) {
                    const totalVal = row[heading]?.date;
                    const hasAmount = totalVal && Number(totalVal) > 0;
                    return (
                      <td
                        key={ind}
                        className={`table-td total-row-cell ${hasAmount ? "total-cell-clickable" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (hasAmount) handleTotalCellClick(heading);
                        }}
                        title={hasAmount ? `Click to view payment breakdown for ${changeDateFormat(heading)}` : ""}
                      >
                        <span className={`total-cell-value ${hasAmount ? "total-cell-value-active" : ""}`}>
                          {totalVal ?? 0}
                        </span>
                      </td>
                    );
                  }
                  // Normal cells
                  return (
                    <td
                      key={ind}
                      className={`table-td ${fixedColumns.includes(heading) ? "sticky-column-td" : ""} ${row["DATE"] == heading ? "td-green" : ""} ${row[heading]?.isNotPaid ? "td-red" : ""} ${isDateEnded(heading, i) ? "td-yellow" : ""}`}
                    >
                      {typeof row[heading] === "object" && row[heading] && "date" in row[heading] ? (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                          <input
                            ref={inputRefs.current[i][ind]}
                            onKeyDown={(e) => handleKeyPress(e, i, heading, row[heading]?.["date"], ind)}
                            style={{ width: "45px" }}
                            className={`table-input ${row["DATE"] === heading ? "td-inp-green" : ""} ${row[heading]?.isNotPaid === 1 ? "td-inp-red" : ""} ${row["DATE"] !== "Total" && isDateEnded(heading, i) ? "td-inp-yellow" : ""}`}
                            value={row[heading]?.["date"] === "" || row[heading]?.["date"] == null ? "0" : row[heading]?.["date"]}
                            onChange={(e) => {
                              onTableChange(heading, i, e.target.value);
                            }}
                          />
                          {row[heading]?.["date"] > 0 && heading !== "Total" && (
                            row[heading]?.payment_method === 'gpay' ? (
                              <PhoneAndroidIcon
                                style={{
                                  fontSize: '14px',
                                  color: '#1976d2',
                                  display: 'block',
                                  margin: '2px auto'
                                }}
                                titleAccess="GPay"
                              />
                            ) : row[heading]?.payment_method === 'cash' ? (
                              <AttachMoneyIcon
                                style={{
                                  fontSize: '14px',
                                  color: '#2e7d32',
                                  display: 'block',
                                  margin: '2px auto'
                                }}
                                titleAccess="Cash"
                              />
                            ) : null
                          )}
                        </div>
                      ) : (
                        row[heading] ?? row[heading.toLowerCase()]
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

export default DailyEntryTable;