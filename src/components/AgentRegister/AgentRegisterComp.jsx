import React, { useState } from "react";
import '../CustomerDetails/customerDetails.css';
import './agentRegister.css';
import SnackbarAlert from "../../common/Alert/SnackbarAlert/SnackBarAlert.jsx";
import BouncingDots from "../../common/Loader/BouncingDots.jsx";
import { apiFunction } from "../../Api/ApiFunction.js";
import { endPointURLs } from "../../Api/endPoints.js";
import TableContainer from "../CommonTableContainer/TableContainer.jsx";
import { tableFectchApi } from "../../utils/TableFunctions/tableFetchApi.js";
import Button from "../../common/Form/Buttton/Button.jsx";
import LabelAndInput from "../../common/Form/LabeAndSelect.jsx/LabelAndInput.jsx";

const AgentRegisterComp = () => {
  // Form state — only 3 fields
  const [values, setValues] = useState({
    agentName: "",
    emailID: "",
    password: "",
    area: "",
    aadhar_no: "",
    contact_no: "",
    address: "",
    // collectAmount: "",
  });

  // Form submit state
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [msg, setMsg] = useState("");

  // Table state — driven by TableContainer's internal useEffect via scrollFunction
  const [datas, setDatas] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);

  // TableContainer calls this whenever page/search changes
  const scrollFunction = async (filters = {}) => {
    await tableFectchApi({
      data: datas,
      setData: setDatas,
      filters,
      setHasMore,
      URL: endPointURLs.getAgents,
      method: "POST",
    });
    setTableLoading(false);
  };

  const onChangeHandler = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const onClear = () => {
    setValues({ agentName: "", emailID: "", password: "", area: "", aadhar_no: "", contact_no: "", address: ""});
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await apiFunction(endPointURLs.insertAgent, "POST", {
      name: values.agentName,
      email_id: values.emailID,
      password: values.password,
      area: values.area,
      aadhar_no: values.aadhar_no,
      contact_no: values.contact_no,
      address: values.address,
      // collect_amount: values.collectAmount,
    });
    if (res?.data?.message === "Successfully Added") {
      setIsSuccess(true);
      setMsg(res.data.message);
      setValues({ agentName: "", emailID: "", password: "", area: "", aadhar_no: "", contact_no: "", address: "" });
      // Reset to page 0 — TableContainer re-fetches automatically
      setDatas([]);
      setPage(0);
    } else {
      setIsError(true);
      setMsg(res?.data?.message || "Something went wrong");
    }
    setLoading(false);
  };

  const onDeleteClick = async (row) => {
    if (window.confirm(`Are you sure you want to delete the agent: ${row['Agent Name']}?`)) {
      try {
        const res = await apiFunction(endPointURLs.deleteAgent, "POST", { id: row['id'] });
        if (res.data.message === "Successfully Deleted") {
          setDatas(prev => prev.filter(item => Number(item.id) !== Number(row.id)));
          alert("Agent deleted successfully.");
        } else {
          alert("Failed to delete agent: " + (res.data.message || "Unknown error"));
        }
      } catch (error) {
        alert("An error occurred while deleting the agent.");
        console.error(error);
      }
    }
  };

  return (
    <>
      {isSuccess && (
        <SnackbarAlert open={isSuccess} setOpen={setIsSuccess} message={msg} />
      )}
      {isError && (
        <SnackbarAlert
          open={isError}
          setOpen={setIsError}
          severity="error"
          message={msg}
        />
      )}

      {!loading ? (
        <div className="left-right-conatiner">

          {/* ── LEFT — Create Agent Form ── */}
          <div className="form-left-container">
            <form className="left-form" onSubmit={onSubmit}>
              <br />
              <LabelAndInput
                label="Agent Name"
                id="agentName"
                name="agentName"
                type="text"
                required={true}
                value={values.agentName}
                onChangeHandler={onChangeHandler}
              />
              <br />
              <LabelAndInput
                label="Email ID"
                id="emailID"
                name="emailID"
                type="email"
                required={true}
                value={values.emailID}
                onChangeHandler={onChangeHandler}
              />
              <br />
              <LabelAndInput
                label="Password"
                id="password"
                name="password"
                type="text"
                required={true}
                value={values.password}
                onChangeHandler={onChangeHandler}
              />
              <br />
              <LabelAndInput
                label="Collection Area"
                id="area"
                name="area"
                type="text"
                required={true}
                value={values.area}
                onChangeHandler={onChangeHandler}
              />
              <br />
              <LabelAndInput
                label="Aadhar Number"
                id="aadhar_no"
                name="aadhar_no"
                type="text"
                required={true}
                value={values.aadhar_no}
                onChangeHandler={onChangeHandler}
              />
              <br />
              <LabelAndInput
                label="Contact Number"
                id="contact_no"
                name="contact_no"
                type="text"
                required={true}
                value={values.contact_no}
                onChangeHandler={onChangeHandler}
              />
              <br />
              <LabelAndInput
                label="Address"
                id="address"
                name="address"
                type="text"
                required={true}
                value={values.address}
                onChangeHandler={onChangeHandler}
              />
              <br />
              {/* <LabelAndInput
                label="Collect Amount"
                id="collectAmount"
                name="collectAmount"
                type="text"
                required={true}
                value={values.collectAmount}
                onChangeHandler={onChangeHandler}
              /> */}
              <br />
              <div className="btns-div">
                <Button className="primary-btn" type="submit">
                  Create Agent
                </Button>
                <Button
                  className="primary-btn"
                  type="button"
                  onClick={onClear}
                >
                  Clear
                </Button>
              </div>
            </form>
          </div>

          {/* ── RIGHT — Agents Table ── */}
          <div className="table-right">
            <TableContainer
              title="Agents"
              datas={datas}
              scrollFunction={scrollFunction}
              page={page}
              setPage={setPage}
              loading={tableLoading}
              setLoading={setTableLoading}
              hasMore={hasMore}
              tableOnClick={() => {}}
              onDeleteClick={onDeleteClick}
            />
          </div>

        </div>
      ) : (
        <BouncingDots />
      )}
    </>
  );
};

export default AgentRegisterComp;