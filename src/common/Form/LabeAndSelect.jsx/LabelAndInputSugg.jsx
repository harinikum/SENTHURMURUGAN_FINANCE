import React, { useEffect, useRef, useState } from "react";
import Select from "../Select/Select";
import "./labelAndInput.css";

const LabelAndInputSugg = ({
  label,
  id,
  type = "text",
  dataList = [],
  setDataList = ()=>{},
  name,
  listName = "",
  required = true,
  checked,
  value,
  onChangeHandler = () => {},
  disabled,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1); // Tracks the active suggestion
  const [isFocused, setIsFocused] = useState(false); // Tracks input focus
//   const [suggestions] = useState(dataList);
//   const [filteredSuggestions, setFilteredSuggestions] = useState(dataList);
  const suggestionRefs = useRef([]);
  const [isSuggestionClicked, setIsSuggestionClicked] = useState(false);

  useEffect(() => {
    if (activeIndex !== -1 && suggestionRefs.current[activeIndex]) {
      suggestionRefs.current[activeIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [activeIndex]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    // setInputValue(value);
    setIsFocused(true);

    // const sortedSuggestions = [...dataList].sort((a, b) => {
    // if(value){
    //     const aStartsWith = a.name.toLowerCase().startsWith(value.toLowerCase());
    //     const bStartsWith = b.name.toLowerCase().startsWith(value.toLowerCase());

    //     if (aStartsWith && !bStartsWith) return -1;
    //     if (!aStartsWith && bStartsWith) return 1;

    //     return a.name.localeCompare(b.name);
    // }
    // else{
    //     return dataList;
    // }
    // });
    const sortedSuggestions = [...dataList].sort((a, b) => {
        if (value) {
          const inputLower = value.toLowerCase();
          const aName = a.name.toLowerCase();
          const bName = b.name.toLowerCase();
    
          // Check for exact match
          const aIsExactMatch = aName === inputLower;
          const bIsExactMatch = bName === inputLower;
          if (aIsExactMatch && !bIsExactMatch) return -1;
          if (!aIsExactMatch && bIsExactMatch) return 1;
    
          // Check if it starts with input
          const aStartsWith = aName.startsWith(inputLower);
          const bStartsWith = bName.startsWith(inputLower);
          if (aStartsWith && !bStartsWith) return -1;
          if (!aStartsWith && bStartsWith) return 1;
          setActiveIndex(0);
          return a.name.localeCompare(b.name);
        }
        // else if(value == ""){
        //   setActiveIndex(-1);
        // }
        return 0;
      });

    onChangeHandler(e);
    setDataList(value ? sortedSuggestions : dataList)
  };

  const handleKeyDown = (e) => {
    if(isFocused){
      if (e.key === "ArrowDown") {
        setActiveIndex((prev) =>
          prev < dataList.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === "ArrowUp") {
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === "Enter" && activeIndex !== -1) {
      //   setInputValue(filteredSuggestions[activeIndex]);
        let dummyE = {
          target : {
              name : name,
              value : dataList[activeIndex]['name']
          }
        }
        onChangeHandler(dummyE);
        setActiveIndex(0);
        setIsFocused(false);
      }
    }
  };

  const handleSuggestionClick = (suggestion,index) => {
    // setInputValue(suggestion);
    setIsSuggestionClicked(true);
    let dummyE = {
        target : {
            name : name,
            value : suggestion['name']
        }
      }
    onChangeHandler(dummyE);
    setActiveIndex(index);
    setIsFocused(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    if (!isSuggestionClicked) {
      setTimeout(() => setIsFocused(false), 200);
    }
    setIsSuggestionClicked(false);
  };

  return (
    <div className="label-and-input" style={{position:"relative"}}>
      <label className="inp-label" htmlFor={id}>
        {label}
      </label>
      <input
          disabled={disabled}
          checked={checked}
          required={required}
          className="lab-input"
          type={type}
          id={id}
          name={name}
          list={listName}
          autoComplete="off"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
        //   onChange={onChangeHandler}
      />
      {isFocused && (
        <ul
          style={{
            position: 'absolute',
            top:"23px",
            right:"0px",
            width: '57%',
            background: 'white',
            border: '1px solid #ccc',
            borderRadius: '4px',
            margin: 0,
            padding: '8px 0',
            listStyle: 'none',
            maxHeight: '150px',
            overflowY: 'auto',
            zIndex: 1000,
          }}
        >
        {dataList.map((item, index) => (
            <li
              key={index}
              ref={(el) => (suggestionRefs.current[index] = el)}
              onMouseDown={() => handleSuggestionClick(item,index)}
              // onClick={() => handleSuggestionClick(item,index)}
              style={{
                padding: '8px',
                cursor: 'pointer',
                background: index === activeIndex ? 'var(--secondary)' : 'white',
                color : index === activeIndex ? "white" : "black"
              }}
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LabelAndInputSugg;
