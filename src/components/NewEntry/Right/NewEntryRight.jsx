import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import BouncingDots from "../../../common/Loader/BouncingDots";
import NewEntryTable from "../../../common/Table/NewEntryTable";
import Button from "../../../common/Form/Buttton/Button";
import { getCurrentDate } from "../../../utils/dateFunctions/dateFunctions";
import { apiFunction } from "../../../Api/ApiFunction";
import { endPointURLs } from "../../../Api/endPoints";
import SnackbarAlert from "../../../common/Alert/SnackbarAlert/SnackBarAlert";
import { getCategoryRange } from "../../../common/utils/categoryUtils";


const NewEntryRight = ({ values, setValues, date, setDate, datas, setDatas, category, setCategory }) => {
  const [isPopUp, setIsPopUp] = useState(false);
  const [isErr, setIsErr] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const openFun = async (selectedDate, selectedCategory) => {
    const targetDate = selectedDate || date || localStorage.getItem('new_entry_date') || getCurrentDate();
    const targetCat = selectedCategory !== undefined ? selectedCategory : (category || '');
    console.log("***** openFun called for date & category *****", targetDate, targetCat);
    const payload = { date: targetDate };
    if (targetCat) {
      payload.category = targetCat;
    }
    const res = await apiFunction(endPointURLs.getNewEntryPayments, "POST", payload);
    console.log("***** API response *****", res.data);
    if (res?.data?.message == "success") {
      const dataArray = res.data.data || [];
      if (dataArray.length > 0) {
        setDatas(dataArray);
      } else {
        setDatas([
          {
            "உ.எண்": "",
            "ரசீது தொகை": "",
            "payment_method": "cash",
          },
        ]);
      }
      setDate(targetDate);
      setValues((prev) => ({ ...prev, name: "", loan: "", place: "", category: targetCat, date: targetDate }));
    }
  };

  // Load data on component mount, route change, or when date/category changes
  const location = useLocation();
  useEffect(() => {
    if (date) {
      openFun(date, category);
    }
  }, [date, location.pathname, category]);



  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!category) {
      alert("Please select Category A or Category B first");
      return;
    }
    // console.log(datas);
    // let filtered = datas.filter((val)=>(!val.hideIsNotEdit && (val['உ.எண்'] != "" && val['ரசீது தொகை']!='')));
    // console.log(filtered);
    let filtered = [];
    let duppCheck = [];
    let isDupp = false;
    datas.forEach((val) => {
      if (val["உ.எண்"] != "") {
        filtered.push(val);
      }
      if (duppCheck.includes(Number(val["உ.எண்"]))) {
        isDupp = true;
      } else {
        duppCheck.push(Number(val["உ.எண்"]));
      }
    });
    if (isDupp) {
      alert("Duplicate values not allowed");
      return;
    }

    // Category range validation for all entered rows
    for (let row of filtered) {
      const num = Number(row["உ.எண்"]);
      if (category) {
        const range = getCategoryRange(category);
        if (range && (num < range.min || num > range.max)) {
          alert(`Customer Number ${num} does not belong to Category ${category} (${range.min}–${range.max})`);
          return;
        }
      }
    }

    // console.log(duppCheck);
    // console.log(isDupp);
    if (filtered.length > 0) {
      let errs = filtered.find(
        (val) => {
          console.log(val)
          return (val.hideIsNotACust ||
            !val["உ.எண்"] ||
            val["உ.எண்"] == 0 ||
            val["ரசீது தொகை"] == "")
        });
      if (!errs) {
        setLoading(true)
        // Debug logs for payment method and payload
        console.log('Selected Payment Method:', values.payment_method);
        const payload = {
          agent_id: localStorage.getItem("user_id_num"),
          date: date,
          category: category,
          payments: filtered
        };
        console.log(
  "Submitting Payments",
  JSON.parse(JSON.stringify(filtered))
);
        console.log('Payload:', payload);
        const res = await apiFunction(
          endPointURLs.insertAndUpdatePayments,
          "POST",
          payload
        );
        // console.log(res);
        if (res.data.message == "success") {
          // Show success feedback and refresh data from server
          setIsPopUp(true);
          setMsg("Successfully Registered");
          await openFun(date, category);
          // Append a new empty row for next entry
          // setDatas(prev => {
          //   const emptyRow = {};
          //   if (prev.length > 0) {
          //     Object.keys(prev[0]).forEach(key => {
          //       if (key === "payment_method") {
          //         emptyRow[key] = "cash";
          //       } else {
          //         emptyRow[key] = "";
          //       }
          //     });
          //   } else {
          //     emptyRow["payment_method"] = "cash";
          //   }
          //   return [...prev, emptyRow];
          // });
        } else {
          if (res.data.message == "Some Inserted Not All") {
            openFun(date, category);
          }
          setIsErr(true);
          setMsg(res.data.message);
        }
        setLoading(false)
        console.log(filtered)
      } else {
        alert("Properly Give Datas");
      }
    } else {
      alert("Give Proper Datas 95");
    }
  };
  const onOverallOk = async () => {
    const res = await apiFunction(endPointURLs.insert_not_gived, "POST", {
      date: date,
    });
    console.log(res);
  };

  return (
    <div className="table-right" id="table-right-entry">
      {/* {
        loaded ? */}
      {/* <form onSubmit={onSubmitHandler}> */}
      {isPopUp && (
        <SnackbarAlert open={isPopUp} setOpen={setIsPopUp} message={msg} />
      )}
      {isErr && (
        <SnackbarAlert
          open={isErr}
          setOpen={setIsErr}
          message={msg}
          severity="error"
        />
      )}
      <div className="new-entry-container">
        <NewEntryTable
          category={category}
          date={date}
          tableDatas={datas}
          setTableDatas={setDatas}
          values={values}
          setValues={setValues}
        />
      </div>
      <div
        style={{ display: "flex", justifyContent: "end", paddingTop: "10px", alignItems: "center", gap: "20px" }}
      >
        <Button
          onClick={onSubmitHandler}
          type="submit"
          className={"pop-cancel-btn"}
          disabled={loading}
        >
          Submit
        </Button>
      </div>
      {/* </form> */}
      {/* : <BouncingDots/>
      } */}
    </div>
  );
};

export default NewEntryRight;