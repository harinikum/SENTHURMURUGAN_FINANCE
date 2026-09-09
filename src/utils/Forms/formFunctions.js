export const onClearClick = (values, setValues, buttons, setButtons)=>{
    const keys = Object.keys(values);
    let tempObj = {};
    keys.forEach((key)=>{
        if(key!= "agent"){
            tempObj[key] = ""
        }
    });
    setValues(tempObj);
    console.log(tempObj);
    
    // console.log(buttons.map((btn)=> btn.name == "Add New" || btn.name == "Clear" ? {...btn,isDisable : false} : {...btn, isDisable : true}));
    
    setButtons(buttons.map((btn)=> btn.name == "Add New" || btn.name == "Clear" ? {...btn,isDisable : false} : {...btn, isDisable : true}))
}