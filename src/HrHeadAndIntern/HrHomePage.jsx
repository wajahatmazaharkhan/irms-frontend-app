
import {HrTopNavBar,HrSideBar} from "../HrHeadAndIntern/HrIndex";
import { useLocation } from "react-router-dom";
function HrHomepage(){


  const location = useLocation();
  const {state}= location;
  console.log(state?.hrid)

    return(
      <>
      
      <HrTopNavBar hrid ={state?.hrid}/>
      <HrSideBar hrid={state?.hrid}/>
      
      </>  
    )




}
 export default HrHomepage;