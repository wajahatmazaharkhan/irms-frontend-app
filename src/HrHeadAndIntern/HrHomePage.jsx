import { HrTopNavBar, HrSideBar } from "../HrHeadAndIntern/HrIndex";
import { useLocation } from "react-router-dom";
import { useHrContext } from "@/context/HrContext.jsx";
import useTitle from "@/Components/useTitle";
function HrHomepage() {
  useTitle('HR Dashboard')
  const { setHrid } = useHrContext();
  const location = useLocation();
  const { state } = location;

  if (state?.hrid) {
    setHrid(state.hrid);
    console.log("yaha se ja rhi hai ", state?.hrid);
  }

  return (
    <>
      <HrTopNavBar />
      <HrSideBar />
    </>
  );
}
export default HrHomepage;
