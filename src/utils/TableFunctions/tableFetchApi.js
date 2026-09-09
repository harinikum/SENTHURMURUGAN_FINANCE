import { apiFunction } from "../../Api/ApiFunction";

export const tableFectchApi = async({data, setData, filters={}, setHasMore, URL, method="POST" })=>{
  try{
    if(URL && method){

      let res = await apiFunction(URL,method,filters);
      let retData = [];
      if(res.data.message == "success"){
        if(filters.offset){
          retData = [...data,...res.data.data];
        }
        else{
          retData = res.data.data;
        }
        if(res.data.data.length < 10){
          setHasMore(false)
          // console.log(false);
          
        }
        else{
          setHasMore(true)
          // console.log(true);

        }
      }
      else{
        return false;
      }
      // console.log(retData);
      
      setData(retData);
      return retData;
    }
    else{
      return "send url and method";
    }
  }
  catch(err){
    console.error(err);
  }
}