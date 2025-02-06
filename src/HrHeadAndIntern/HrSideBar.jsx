import { useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useHrContext } from "@/context/HrContext.jsx";
function HrSideBar() {
  const [activeItem, setActiveItem] = useState("home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const {hrid} = useHrContext();
  console.log("got hr id in ",hrid);

  const handleItemClick = (item) => {
    setActiveItem(item);
    setIsSidebarOpen(false); 
  };

  const toggleSideBar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <button
        onClick={toggleSideBar}
        className="md:hidden p-2 text-white bg-blue-500 fixed top-16  z-50"
      >
        {isSidebarOpen ? "X" : "☰"}
      </button>

      <div
        className={`sidebar-main-container bg-slate-600 fixed top-0 left-0 z-40 transform mt-16 md:mt-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 md:translate-x-0 md:relative md:w-40 `}
        style={{
            height: "calc(100vh - 4rem)", 
          }}
      >
        <div className="sidebar-nav-container flex flex-col p-4 mt-16 md:mt-0">
          <Link
            to="/hrhomepage"
            className={`block px-4 py-2 text-white ${
              activeItem === "home" ? "font-bold" : "font-normal"
            }`}
            onClick={() => handleItemClick("home")}
          >
            Home
          </Link>

          {/* <Link
            to="/hrinterns"
            className={`block px-4 py-2 text-white ${
              activeItem === "hrinterns" ? "font-bold" : "font-normal"
            }`}
            onClick={() => handleItemClick("hrinterns")}
          >
            HR Interns
          </Link> */}

          <Link
          // state= {{hrid}}
          to="/hrinternsattendance"
          className={`block px-4 py-2 text-white   ${activeItem==="hrinternsattendance" ? "font-bold" : "font-normal"}`}
          onClick={()=>handleItemClick("hrinternsattendance")}
          >Interns attendance</Link>

          <Link
          to="/internsleaveapplications"
          className={`block px-4 py-2 text-white ${activeItem==="internsleaveapplications" ? "font-bold" : "font-normal"}`}
          >Leave applications</Link>
          <Link
            to="/hrhelp"
            className={`block px-4 py-2 text-white ${
              activeItem === "hrhelp" ? "font-bold" : "font-normal"
            }`}
            onClick={() => handleItemClick("hrhelp")}
          >
            Help
          </Link>
        </div>
      </div>
    </>
  );
}
HrSideBar.propTypes = {
  hrid: PropTypes.string.isRequired, // Ensures hrid is a required string
};

export default HrSideBar;
