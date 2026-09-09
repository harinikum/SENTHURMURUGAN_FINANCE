import React, { useEffect, useRef, useState } from "react";
import NormalTable from "../../common/Table/NormalTable";
import './tableContainer.css';

const TableContainer = ({
  title = "",
  datas = [],
  tableOnClick = () => {},
  scrollFunction=()=>{},
  hasMore,
  loading,
  setLoading=()=>{},
  page,
  setPage=()=>{},
  notIsDateFilterBtn,
  URL,
  extraPayloads,
  selectedRow=null,
  setSelectedRow=()=>{},
  hideColumns,
  onDeleteClick
}) => {
  const [dateFilter, setDateFilter] = useState({
    fromDate: "",
    toDate: "",
  });
  const [sortByFilter, setSortByFilter] = useState({
    sortBy: "",
    orderBy: "DESC",
  });
  const [searchInput, setSearchInput] = useState("");

  const [isFilterPopUp, setIsFilterPopUp] = useState(false);
  const [isDateFilter, setIsDateFilter] = useState(false);

  const tableRef = useRef(null);

  useEffect(() => {
      let filters = {
        offset : page*12,
        limit : 12,
        search_term : searchInput,
        // from_date : dateFilter.fromDate,
        // to_date : dateFilter.toDate,
        // sort_by : sortByFilter.sortBy,
        // order_by : sortByFilter.orderBy
      }
      setLoading(true);
      scrollFunction(filters);
  }, [page,searchInput,isDateFilter]);

  const onDateSubmit = ()=>{
    setIsFilterPopUp(false);
    setPage(0);
    setIsDateFilter(!isDateFilter)
  }

  const handleScroll = () => {
    if (tableRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = tableRef.current;
      if (scrollTop + clientHeight >= scrollHeight-1 && !loading && hasMore) {
        setPage((prevPage) => prevPage + 1); 
      }
    }
    // console.log(hasMore);
    
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
  }, [loading]);

  const searchOnChange = (e)=>{
    setSearchInput(e.target.value);
    setPage(0)
  }

  return (
    <div className="table-container-div-par">
      <div className="table-container-heading">
        <p className="entry-form-title">{title}</p>
        <input type="text" onChange={searchOnChange} />
      </div>
      <div className="table-container-body" ref={tableRef}>
        <NormalTable hideColumns={hideColumns} selectedRow={selectedRow} loading={loading} tableDatas={datas} onClick={tableOnClick} onDeleteClick={onDeleteClick} />
        {/* {loading && <LinearLoading/>} */}
      </div>
    </div>
  );
};

export default TableContainer;