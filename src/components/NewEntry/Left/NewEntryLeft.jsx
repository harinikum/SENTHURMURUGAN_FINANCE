import React, { useEffect, useRef, useState } from 'react'
import Button from '../../../common/Form/Buttton/Button'
import LabelAndInput from '../../../common/Form/LabeAndSelect.jsx/LabelAndInput'
import LabelAndInputSugg from '../../../common/Form/LabeAndSelect.jsx/LabelAndInputSugg'
import { newEntryArr } from './newEntryArr'
import { apiFunction } from '../../../Api/ApiFunction'
import { endPointURLs } from '../../../Api/endPoints'

const NewEntryLeft = ({values, setValues, setDate, datas, setDatas, category, setCategory}) => {

  const debounceRef = useRef(null);
  const [formArr, setFormArr] = useState(newEntryArr);
  const [allCategories, setAllCategories] = useState(['A', 'B']);

  const loadCategories = async () => {
    try {
      const res = await apiFunction(endPointURLs.getMembers, "POST", {});
      if (res?.data?.message === "success" && Array.isArray(res.data.data)) {
        const catSet = new Set(['A', 'B']);
        res.data.data.forEach((item) => {
          const cat = item.Category || item.category;
          if (cat && typeof cat === 'string' && cat.trim()) {
            catSet.add(cat.trim().toUpperCase());
          }
        });
        setAllCategories(Array.from(catSet).sort());
      }
    } catch (e) {
      console.error("Failed to load dynamic categories:", e);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const fetchCategoryMembers = async (cat) => {
    if (!cat) {
      setFormArr(prev => prev.map((val) => val.name === "name" ? { ...val, dataList: [] } : val));
      return;
    }
    const res = await apiFunction(endPointURLs.getMembersNameId, "POST", { category: cat });
    console.log("Category members fetched:", res);
    if (res?.data?.message === "success" && res?.data?.data) {
      setFormArr(prev => prev.map((val) => val.name === "name" ? {
        ...val,
        dataList: res.data.data.map((m) => {
          const mName = m.name || m['Customer Name'] || '';
          const place = m.place || '';
          const amount = m.emi_amount || m['Loan Amount'] || '';
          return `${mName} / ${place} / ${amount}`;
        })
      } : val));
    } else {
      setFormArr(prev => prev.map((val) => val.name === "name" ? { ...val, dataList: [] } : val));
    }
  };

  useEffect(() => {
    fetchCategoryMembers(category);
  }, [category]);

  const handleCategoryChange = (selectedCat) => {
    setCategory(selectedCat);
    setValues(prev => ({
      ...prev,
      category: selectedCat,
      name: '',
      loan: '',
      place: ''
    }));
  };

  const onSubmitHandler = (e) => {

  };
  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    if (name === "date") {
      setValues((prev) => ({ ...prev, [name]: value }));
      localStorage.setItem("new_entry_date", value);
      setDate(value);
    } else if (name === "name") {
      if (!category) {
        alert("Please select a Category (A or B) first");
        return;
      }
      const isSelection = value.includes('/');
      let splitted = value.split('/');
      let displayName = splitted && splitted[0] ? splitted[0].trim() : value;

      setValues((prev) => ({ ...prev, [name]: displayName, category: category }));

      if (isSelection) {
        e.target.blur();
      } else if (displayName.trim()) {
        // Fetch dynamic search results for the selected category while user is typing
        apiFunction(endPointURLs.getMembersNameId, "POST", { search_term: displayName, category: category }).then((res) => {
          if (res?.data?.message === "success" && res?.data?.data) {
            setFormArr(prev => prev.map((val) => val.name === "name" ? {
              ...val,
              dataList: res.data.data.map((m) => {
                const mName = m.name || m['Customer Name'] || '';
                const place = m.place || '';
                const amount = m.emi_amount || m['Loan Amount'] || '';
                return `${mName} / ${place} / ${amount}`;
              })
            } : val));
          }
        });
      }

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(async () => {
        let spl = value.split('/');
        let nameVal = spl[0] ? spl[0].trim() : '';
        let emiVal = spl[2] ? spl[2].trim() : (spl[1] && !isNaN(spl[1].trim()) ? spl[1].trim() : undefined);

        let payload = { name: nameVal };
        if (category) {
          payload.category = category;
        }
        if (emiVal) {
          payload.emi_amount = emiVal;
        }

        const res = await apiFunction(endPointURLs.getOneMember, "POST", payload);

        if (res?.data?.message === "success") {
          let tempDatas = [...datas];

          let targetIdx = -1;
          if (
            values.activeIndex !== undefined &&
            values.activeIndex >= 0 &&
            values.activeIndex < tempDatas.length &&
            !tempDatas[values.activeIndex]?.hidePayId
          ) {
            targetIdx = values.activeIndex;
          } else {
            targetIdx = tempDatas.findIndex(row => !row.hidePayId && (!row['உ.எண்'] || row['உ.எண்'] === ''));
          }

          if (targetIdx === -1) {
            targetIdx = tempDatas.length;
            tempDatas.push({
              'உ.எண்': '',
              'ரசீது தொகை': '',
              payment_method: values.payment_method || 'cash'
            });
          }

          setValues(prev => ({
            ...prev,
            activeIndex: targetIdx,
            name: res.data.data['Customer Name'],
            loan: res.data.data['Balance Amount'],
            place: res.data.data.place,
            category: res.data.data.category || res.data.data['Category'] || category || ''
          }));

          tempDatas[targetIdx] = {
            ...tempDatas[targetIdx],
            'உ.எண்': res.data.data['உ.எண்'] || res.data.data['id'] || res.data.data['note_id'] || res.data.data['user_unique_id'] || res.data.data['cus_id'] || '',
            hideMemberId: res.data.data['id'],
            hideLoanAmount: res.data.data['Loan Amount'],
            hideBalanceAmount: res.data.data['Balance Amount'],
            'ரசீது தொகை': res.data.data.emi_amount || res.data.data['emi_amount'] || res.data.data['EMI Amount'] || res.data.data['emiAmount'] || '',
            hideEmiID: res.data.data['emi_id'],
            hideMemberName: res.data.data['Customer Name'],
            hideMemberPlace: res.data.data.place,
            hideMemberCategory: res.data.data.category || res.data.data['Category'] || category || ''
          };
          setDatas(tempDatas);
        } else {
          setValues(prev => ({ ...prev, loan: '', place: '', category: category || '' }));
        }
      }, 400);
    } else {
      setValues((prev) => ({ ...prev, [name]: value }));
    }
  };


  const handlePaymentMethodChange = (e) => {
    const val = e.target.value;
    setValues(prev => ({ ...prev, payment_method: val }));
    const activeIdx = values.activeIndex !== undefined ? values.activeIndex : 0;
    if (datas && datas[activeIdx]) {
      setDatas(prev => {
        const updated = [...prev];
        updated[activeIdx] = { ...updated[activeIdx], payment_method: val };
        return updated;
      });
    }
  };

  return (
    <div className='form-left-container'>
      <form className="left-form new-entr-form" onSubmit={onSubmitHandler}>
        <div className="label-and-input" style={{ marginBottom: '15px' }}>
          <label className="inp-label" htmlFor="category_select">Category</label>
          <select
            id="category_select"
            className="lab-input"
            value={category || ''}
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            <option value="">-- Select Category --</option>
            {allCategories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <br />
        {
          formArr.map((val,ind)=><><LabelAndInput key={ind} label={val.label} id={val.name} required={val.required} name={val.name} listName={val.listName} type={val.type} onChangeHandler={onChangeHandler} value={values[val.name] || ''} dataList={val.dataList} disabled={val.name === 'name' && !category} /> <br /></>)
        }
        <div className="label-and-input" style={{ marginTop: '15px' }}>
          <label className="inp-label">Payment Method</label>
          <div className="radio-group-container" style={{ display: 'flex', gap: '20px', alignItems: 'center', width: '50%' }}>
            <label className="custom-radio" style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 'bold', color: '#333' }}>
              <input 
                type="radio" 
                name="left_payment_method" 
                value="cash" 
                checked={(values.payment_method || 'cash') === 'cash'} 
                onChange={handlePaymentMethodChange} 
                style={{ width: '16px', height: '16px', padding: 0, margin: 0, cursor: 'pointer' }}
              />
              Cash
            </label>
            <label className="custom-radio" style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 'bold', color: '#333' }}>
              <input 
                type="radio" 
                name="left_payment_method" 
                value="gpay" 
                checked={(values.payment_method || 'cash') === 'gpay'} 
                onChange={handlePaymentMethodChange} 
                style={{ width: '16px', height: '16px', padding: 0, margin: 0, cursor: 'pointer' }}
              />
              GPay
            </label>
          </div>
        </div>
        <br />
        {/* <Button className={"primary-btn"} type='button' onClick={onDownloadClick} disabled={downloadLoad}>Download as PDF</Button> */}
      </form>
    </div>
  )
}

export default NewEntryLeft