import React, { useEffect, useState } from 'react'
import SnackbarAlert from '../../common/Alert/SnackbarAlert/SnackBarAlert'
import PopUpAlert from '../../common/Alert/Popups/PopupAlert';
import BouncingDots from '../../common/Loader/BouncingDots';
import { Delete } from '@mui/icons-material';
import NewEntryLeft from './Left/NewEntryLeft';
import NewEntryRight from './Right/NewEntryRight';
import { getCurrentDate } from '../../utils/dateFunctions/dateFunctions';

const NewEntry = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setisError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState('');
  const [values, setValues] = useState({ date: getCurrentDate(), category: '' });

  const [date, setDate] = useState(getCurrentDate());
  const [datas, setDatas] = useState([
    {
      "உ.எண்": "",
      "ரசீது தொகை": "",
      "payment_method": "cash",
    },
  ]);

  // Initialize date in localStorage and clear previous category persistence
  useEffect(() => {
    localStorage.setItem('new_entry_date', getCurrentDate());
    localStorage.removeItem('new_entry_category');
  }, []);

  // Load persisted entries from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('new_entry_datas');
    if (stored) {
      try {
        setDatas(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse stored entry data', e);
      }
    }
  }, []);

  // Persist entries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('new_entry_datas', JSON.stringify(datas));
  }, [datas]);

  useEffect(() => {
    console.log("***** datas changed *****", datas);
  }, [datas]);

  return (
    <>
      {isSuccess && (
        <SnackbarAlert open={isSuccess} setOpen={setIsSuccess} message={msg} />
      )}
      {isError && (
        <SnackbarAlert
          open={isError}
          setOpen={setisError}
          severity="error"
          message={msg}
        />
      )}
      {!loading ? (
        <div className="new-entry-page">
          <div className="new-entry-wrapper">
            <div className="new-entry-left-panel">
              <NewEntryLeft category={category} setCategory={setCategory} datas={datas} setDatas={setDatas} setDate={setDate} values={values} setValues={setValues} />
            </div>
            <div className="new-entry-right-panel">
              <NewEntryRight category={category} setCategory={setCategory} date={date} setDate={setDate} values={values} setValues={setValues} datas={datas} setDatas={setDatas} />
            </div>
          </div>
        </div>
      ) : (
        <BouncingDots />
      )}
    </>
  )
}

export default NewEntry