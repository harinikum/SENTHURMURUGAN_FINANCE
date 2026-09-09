import { format, parseISO, isValid } from "date-fns";

export const getCurrentDate = ()=>{
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const dd = String(today.getDate()).padStart(2, '0');

    // console.log(`${yyyy}-${mm}-${dd}`);
    
    return `${yyyy}-${mm}-${dd}`;
}

export const getCurrentMonth = ()=>{
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const dd = String(today.getDate()).padStart(2, '0');

    // console.log(`${yyyy}-${mm}-${dd}`);
    
    return `${yyyy}-${mm}`;
}

export const lastDateOfMonth=(date)=>{
    const givenDate = new Date(date);
    const yyyy = givenDate.getFullYear();
    const mm = String(givenDate.getMonth() + 2).padStart(2, '0'); // Months are 0-based
    const dd = String(givenDate.getDate()).padStart(2, '0');

    const afterOneMonth = new Date(`${yyyy}-${mm}-${dd}`);
    // console.log(afterOneMonth);
    return afterOneMonth;
}


export function isValidDate(dateString) {
    // Regular expression to match the yyyy-mm-dd format
    const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

    // Check if the string matches the format
    if (!regex.test(dateString)) {
        return false;
    }

    // Parse the date and check if it's valid
    const date = new Date(dateString);
    const [year, month, day] = dateString.split("-").map(Number);

    // Check if the parsed date matches the input values
    return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 && // Month is zero-based
        date.getDate() === day
    );
}


export const changeDateFormat = (dateStr)=>{
    if(isValidDate(dateStr)){
        const formattedDate = format(parseISO(dateStr), "MMM_dd");
        return formattedDate;
    }
    return dateStr;
}

export const changeDateYYMMDD = (dateStr)=>{
    if(isValidDate(dateStr)){
        const [year, month, day] = dateStr.split("-");
        return `${day}-${month}-${year}`
    }
    else{
        return dateStr;
    }
}