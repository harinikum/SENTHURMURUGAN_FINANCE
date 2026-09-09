import * as React from "react";
import Popover from "@mui/material/Popover";
import Box from "@mui/material/Box";
import { FormControlLabel, Radio, RadioGroup, useMediaQuery } from "@mui/material";
import Button from "../../Form/Buttton/Button";
import LabelAndInput from "../../Form/LabeAndSelect.jsx/LabelAndInput";
import { getCurrentDate } from "../../../utils/dateFunctions/dateFunctions";
import { apiFunction } from "../../../Api/ApiFunction";
import { endPointURLs } from "../../../Api/endPoints";

export default function SAPopUp({ open, setOpen=()=>{}, message='Successfully Completed', isSuccess = true,emiId, date = getCurrentDate(),snackBarOpen,setSnackBarOpen,setMsg=()=>{}, onClose}) {
  const [selected, setSelected] = React.useState("date");
  const [element, setElement] = React.useState(null);
  const isBelow430 = useMediaQuery("(max-width:430px)");

  // const [loanAmt, setLoanAmt] = React.useState(0);
  // const [dateOfLoan, setDateOfLoan] = React.useState(date);

  const [values, setValues] = React.useState(
    {
      loanAmt : 0,
      dateOfLoan : date
    }
  )



  const [style, setStyle] = React.useState({
    width: 400,
    bgcolor: "#fff",
    boxShadow: 24,
    // borderRadius: "15px",
    height: "25vh",
    fontSize : 18,
    display : "flex",
    justifyContent : "center",
    alignItems : "center",
    padding : "15px"
  })

  const okOnClick = async()=>{
    if(emiId && values.dateOfLoan && values.loanAmt){
        const res = await apiFunction(endPointURLs.insertAndFinishEmi,"POST",{emi_id : emiId,loan_amount : values.loanAmt,date_of_loan : values.dateOfLoan})
        // if(res.data.message == "success"){
          setSnackBarOpen(true);
          setMsg(res.data.message);
          setOpen(false);
          onClose();
        // }
    }
    else{
        alert('Enter Values');
    }
  }

  React.useEffect(()=>{
    let sideNav = document.getElementById("table-right-entry");
    if(sideNav){
      setElement(sideNav)
    }
    else{
      let rootId = document.getElementById("root");
      setElement(rootId)
    }
    if(isBelow430){
      setStyle({...style,width:250,fontSize:12});
      // console.log(style);
    }
    else{
      setStyle({...style,width:400,fontSize:18});
    }
  },[])

  const onChangeHandler = (e)=>{
    setValues({...values, [e.target.name] : e.target.value});
  }

  return (
    <Popover
      open={open}
      anchorEl={element} // This is the target element for positioning
      onClose={(()=>setOpen(false))}
      anchorOrigin={{
        vertical: 'center',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'center',
        horizontal: 'center',
      }}
      sx={{
        "& .MuiPaper-root": {
        //   backgroundColor: "rgba(0, 0, 0, 0.5)", // Updated way to set background color
        //   backdropFilter: "blur(5px)", // Optional: Add a blur effect for smoother look
          borderRadius: "15px", // Round the corners
        },
      }}
    >
      <Box sx={style} >
        <div>
            <LabelAndInput name={'loanAmt'} label={'Loan Amount'} value={values.loanAmt} type={'number'} onChangeHandler={onChangeHandler} />
            <br />
            <LabelAndInput name={'dateOfLoan'} disabled={true} label={'Date Of Loan'} value={values.dateOfLoan} type={'date'} onChangeHandler={onChangeHandler} />
        <br />
        <div style={{display:"flex",justifyContent:"center"}}>
            <Button className={isSuccess ? "pop-done-btn" : "pop-err-btn"} onClick={okOnClick ? okOnClick : setOpen(false)}>Submit</Button>
        </div>
        </div>
      </Box>
    </Popover>
  );
}