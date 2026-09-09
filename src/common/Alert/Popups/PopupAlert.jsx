import * as React from "react";
import Popover from "@mui/material/Popover";
import Box from "@mui/material/Box";
import { FormControlLabel, Radio, RadioGroup, useMediaQuery } from "@mui/material";
import Button from "../../Form/Buttton/Button";

export default function PopUpAlert({ open, setOpen=()=>{}, message='Successfully Completed',okOnClick=()=>{}, isSuccess = true}) {
  const [selected, setSelected] = React.useState("date");
  const [element, setElement] = React.useState(null);
  const isBelow430 = useMediaQuery("(max-width:430px)");

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


  const handleClose = () => {
    // okOnClick();
    if(okOnClick){
      okOnClick()
    }
    setOpen(false);
  };

  React.useEffect(()=>{
    let sideNav = document.getElementById("nav-root");
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

  React.useEffect(() => {
    // Toggle the blur class when the popup is open or closed
    // const rootElement = document.getElementById("root");
    let sideNav = document.getElementById("nav-root");
    let rootElement = '';
    if(sideNav){
        rootElement = sideNav
    }
    else{
        rootElement = document.getElementById("root");
    }
    if (open) {
      rootElement.classList.add("blurred-background");
    } else {
      rootElement.classList.remove("blurred-background");
    }

    return () => {
      rootElement.classList.remove("blurred-background"); // Clean up on component unmount
    };
  }, [open]);

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
          backgroundColor: "rgba(0, 0, 0, 0.5)", // Updated way to set background color
          backdropFilter: "blur(5px)", // Optional: Add a blur effect for smoother look
          borderRadius: "15px", // Round the corners
        },
      }}
    >
      <Box sx={style} >
        <div>
        {/* <div> */}
            <p>{message}</p>
        {/* </div> */}
        <br />
        <div style={{display:"flex",justifyContent:"space-around"}}>
            <Button className={"pop-cancel-btn"} onClick={()=>setOpen(false)}>Cancel</Button>
            <Button className={isSuccess ? "pop-done-btn" : "pop-err-btn"} onClick={okOnClick ? okOnClick : ()=>setOpen(false)}>Done</Button>
        </div>
        </div>
      </Box>
    </Popover>
  );
}