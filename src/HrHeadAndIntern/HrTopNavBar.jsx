/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import iisprLogo from "../assets/Images/iisprlogo.png";
import { Logout } from "@/Pages/pageIndex";
 function HrTopNavBar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    
    localStorage.removeItem("authToken");
    sessionStorage.clear(); 
    navigate("/login");
  };
  

  return (
    <nav className="bg-white shadow-md">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
         
          <div className="flex-shrink-0">
            <img
              className="w-auto h-10"
              src={iisprLogo} 
              alt="Connect Counsellor Logo"
            />
          </div>

         
          <div className="block md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-600 focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>

         
          <div className="hidden md:flex md:space-x-6 md:items-center lg:mr-20 ">
            <div className="navelemets md:space-x-12">
              <Link
                to="/hrhomepage"
                className="font-medium text-black hover:text-red-500"
              >
                Home
              </Link>
              <Link
                to="/hrallusersinterns"
                className="font-medium text-black hover:text-red-500"
              >
                All Interns
              </Link>
              <Link
                to="/hrprogressreport"
                className="font-medium text-black hover:text-red-500"
              >
                Progress Report
              </Link>
              <Link
                to="/hrtaskassignment"
                className="font-medium text-black hover:text-red-500"
              >
                Task Assignment
              </Link>
              <Link
                to="/hrtasksubmissions"
                className="font-medium text-black hover:text-red-500"
              >
                Task Submissions
              </Link>
            </div>
          </div>

       
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-white transition duration-300 bg-red-500 rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden">
            <Link
              to="/hrhomepage"
              className="block px-4 py-2 text-black border-b hover:text-blue-500"
            >
              Home
            </Link>

            <Link
              to="/hrallusersinterns"
              className="block px-4 py-2 text-black border-b hover:text-blue-500"
            >
              All Interns
            </Link>
    
            <Link
              to="/hrprogressreport"
              className="block px-4 py-2 text-black border-b hover:text-blue-500"
            >
              Progress Report
            </Link>
            <Link
              to="/hrtaskassignment"
              className="block px-4 py-2 text-black border-b hover:text-blue-500"
            >
              Task Assignment
            </Link>
            <Link
              to="/hrtasksubmissions"
              className="block px-4 py-2 text-black border-b hover:text-blue-500"
            >
              Task Submissions
            </Link>

            
            
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 mt-2 text-left text-white transition duration-300 bg-red-500 rounded-md hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default HrTopNavBar;