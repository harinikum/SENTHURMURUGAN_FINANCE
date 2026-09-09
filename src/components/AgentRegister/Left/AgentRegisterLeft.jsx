import React from "react";
import { agentRegisterArr } from "../agentRegisterArr";
import LabelAndInput from "../../../common/Form/LabeAndSelect.jsx/LabelAndInput";
import Button from "../../../common/Form/Buttton/Button";
import {
  onAddNewSubmitHandler,
  onClearClick,
  onUpdateSubmitHandler,
} from "../functions";

const AgentRegisterLeft = ({
  loading,
  setLoading=()=>{},
  values = {},
  setValues = () => {},
  buttons = [],
  setButtons = () => {},
  setMsg = ()=>{},
  setIsSuccess = ()=>{},
  setisError=()=>{},
  onDeleteClick=()=>{}
}) => {
  const onSubmitHandler = (e) => {
    e.preventDefault();
    let submitType = buttons.find((val) => !val.isDisable);
    if(submitType.name == "Add New"){
      onAddNewSubmitHandler({values : values, setValues : setValues, setLoading : setLoading, setMsg : setMsg, setIsSuccess : setIsSuccess, setisError : setisError})
    }
    else if(submitType.name == "Update"){
      onUpdateSubmitHandler({values : values, setValues : setValues, setLoading : setLoading, setMsg : setMsg, setIsSuccess : setIsSuccess, setisError : setisError, buttons : buttons, setButtons : setButtons})
    }
    // console.log(submitType);
    // submitType.onClick(values);
  };
  const onChangeHandler = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  return (
    <div className="form-left-container">
      <form className="left-form" onSubmit={onSubmitHandler}>
        <br />
        {agentRegisterArr.map((val, ind) => (
          (val.name !="emailID" && val.name !="password") || ((val.name =="emailID" || val.name =="password") && buttons[1].isDisable) ?
          <>
            <LabelAndInput
              name={val.name}
              key={ind}
              label={val.label}
              id={val.name}
              required={val.required}
              type={val.type}
              listName={val.listName}
              dataList={val.dataList}
              value={values[val.name]}
              onChangeHandler={onChangeHandler}
            />{" "}
            <br />{" "}
          </> : ""
        ))}
        <div className="btns-div">
          {buttons.map(
            (btn, ind) =>
              !btn.isDisable && (
                <Button
                  key={ind}
                  className={"primary-btn"}
                  type={
                    btn.name == "Update" || btn.name == "Add New"
                      ? "submit"
                      : "button"
                  }
                  onClick={
                       btn.name == "Delete"
                      ? () => onDeleteClick()
                      : (btn.name == 'Clear') ? () => onClearClick(values, setValues, buttons, setButtons) : undefined
                  }
                >
                  {btn.name}
                </Button>
              )
          )}
        </div>
      </form>
    </div>
  );
};

export default AgentRegisterLeft;
