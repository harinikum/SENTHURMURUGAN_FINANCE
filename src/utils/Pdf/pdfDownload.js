import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Logo from '../../assets/LOGO/sai_baba.png'
import { apiFunction } from '../../Api/ApiFunction';
   
   export const downloadPDF = async({data=[],name="data",url,payload,setLoading,id}) => {

    if(data.length <=0 && !url){
        return;
    }
    let fullData = data;
    if(url){
      setLoading(true);
      let finalPayload = payload
      const res = await apiFunction(url,"POST",finalPayload);
      if(res.data.message == "success"){
        fullData = res.data.data; 
      }
      // console.log(res);
      setLoading(false);
    }
      const doc = new jsPDF();
      doc.setTextColor(24, 96, 73);
      doc.setFontSize(10);
      doc.setFont("helvetica","bold");
      doc.text(name, 15, 25);

      if(id){
        doc.setTextColor(24, 96, 73);
        doc.setFontSize(10);
        doc.setFont("helvetica","bold");
        doc.text(id, 150, 45);
      }
  
      // Define the headers and map the data to rows
      let headers = Object.keys(fullData[0]);
      headers = headers.filter((val)=>(!val.includes("is") && val!="Agent Name" && !val.includes("Aadhar") && !val.includes("Image") && !val.includes("hide")))
      headers = headers.map((val)=>val == "id" ? "Sno" : val)
      const rows = fullData.map((item,ind) => headers.map(header => header=="Sno" ? ind+1 : item[header]));

      doc.autoTable({
        didDrawPage: function (data) {
          doc.addImage(Logo,'PNG', 75, 1, 30, 20);
        },
        head: [headers],
        body: rows,
        startY: 27,
        headStyles: { fillColor: [24, 96, 73], textColor: [255, 255, 255] },
        margin: { top: 2 },
        bodyStyles: { textColor: [44, 62, 80] },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        rowStyles: {
          fillColor: [220, 220, 220],
        }
      });
  
      doc.save(`${name}.pdf`);
    };

   export const generatePDFMonth = async({data=[],name="data",url,payload,setLoading,id}) => {

    if(data.length <=0 && !url){
        return;
    }
    let fullData = data;
    if(url){
      setLoading(true);
      let finalPayload = payload
      const res = await apiFunction(url,"POST",finalPayload);
      if(res.data.message == "success"){
        fullData = res.data.data; 
      }
      // console.log(res);
      setLoading(false);
    }
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm', // Measurements in millimeters
        format: 'a4' // Specify A2 page size
      });
      doc.setTextColor(24, 96, 73);
      doc.setFontSize(10);
      doc.setFont("helvetica","bold");
      doc.text(name, 10, 20);

      if(id){
        doc.setTextColor(24, 96, 73);
        doc.setFontSize(10);
        doc.setFont("helvetica","bold");
        doc.text(id, 150, 45);
      }
  
      // Define the headers and map the data to rows
      let headers = Object.keys(fullData[0]);
      headers = headers.filter((val)=>(!val.includes("is") && val!="Agent Name" && !val.includes("Aadhar") && !val.includes("Image") && !val.includes("hide")))
      headers = headers.map((val)=>val == "id" ? "Sno" : val)
      const rows = fullData.map((item,ind) => headers.map(header => header=="Sno" ? ind+1 : item[header]));

      doc.autoTable({
        // didDrawPage: function (data) {
        //   doc.addImage(Logo,'PNG', 75, 1, 30, 20);
        // },
        head: [headers],
        body: rows,
        startY: 27,
        headStyles: { fillColor: [24, 96, 73], textColor: [255, 255, 255] },
        margin: { top: 2 },
        bodyStyles: { textColor: [44, 62, 80] },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        rowStyles: {
          fillColor: [220, 220, 220],
        }
      });
  
      doc.save(`${name}.pdf`);
    };