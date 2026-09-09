import React, { useEffect, useRef, useState } from "react";
import DailyEntryTable from "../../../../common/Table/DailyEntryTable";
import { dummyEmiDatas } from "../../../../common/Table/dummyDatas";
import {
  getCurrentDate,
  lastDateOfMonth,
} from "../../../../utils/dateFunctions/dateFunctions";
import BouncingDots from "../../../../common/Loader/BouncingDots";

const DailyEntryRight = ({ datas = [], setDatas = () => {},open = false, setOpen = ()=>{}, setMsg=()=>{} , loading, setLoading}) => {
  const tableRef = useRef(null);
  // const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true); // New state to check if there's more data

  const fetchMoreData = async (pages) => {
    setLoading(true);
    const filters = {
      offset: pages * 10,
      limit: 10,
    };

    try {
      // setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchMoreData(page);
  }, []);

  const handleScroll = () => {
    if (tableRef.current) {
      const {
        scrollTop,
        scrollHeight,
        scrollWidth,
        clientWidth,
        clientHeight,
        scrollLeft,
      } = tableRef.current;
      const scrollRight =
        tableRef.current.scrollWidth -
        tableRef.current.clientWidth -
        tableRef.current.scrollLeft;
      if (scrollTop + clientHeight >= scrollHeight - 1 && !loading && hasMore) {
        fetchMoreData();
      }
    }
  };

  useEffect(() => {
    const tableElement = tableRef.current;
    if (tableElement) {
      tableElement.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (tableElement) {
        tableElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, [loading, hasMore]);

  return (
    <>
      {!loading ? (
        <div ref={tableRef} className="daily-entry-right">
          {Array.isArray(datas) && datas.length > 0 ? (
            <DailyEntryTable setMsg={setMsg} open={open} setOpen={setOpen} tableDatas={datas} setTableDatas={setDatas} />
          ) : (
            <h1
              style={{
                height: "100%",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              No Datas Found
            </h1>
          )}
        </div>
      ) : (
        <div className="daily-entry-right">
          <BouncingDots />
        </div>
      )}
    </>
  );
};

export default DailyEntryRight;