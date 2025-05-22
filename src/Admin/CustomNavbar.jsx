/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import iisprLogo from "../assets/Images/iisprlogo.png";
import {
  Home,
  FolderOpen,
  FileText,
  CheckSquare,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { Logout } from "@/Pages/pageIndex";

export default function CustomNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);

  const handleLogout = () => {
    // Clear any stored authentication data (like tokens or session)
    localStorage.removeItem("authToken"); // Remove token from localStorage
    sessionStorage.clear(); // Clear sessionStorage
    // Redirect to the homepage
    navigate("/logout");
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setProfileDropdown(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const navigationItems = [
    {
      name: "Home",
      path: "/admin-access",
      icon: Home,
      active: location.pathname === "/Adminhomepage",
    },
    {
      name: "Project Management",
      path: "/Projectmanagement",
      icon: FolderOpen,
      active: location.pathname === "/Projectmanagement",
    },
    {
      name: "Weekly Report",
      path: "/Weeklyreport",
      icon: FileText,
      active: location.pathname === "/Weeklyreport",
    },
    {
      name: "Task Assignment",
      path: "/Taskassignment",
      icon: CheckSquare,
      active: location.pathname === "/Taskassignment",
    },
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <img
                className="w-auto h-10 transition-transform duration-200 hover:scale-105"
                src={iisprLogo}
                alt="IISPR Logo"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Admin Portal
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-1">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    item.active
                      ? "bg-blue-100 text-blue-700 shadow-sm"
                      : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Admin Profile Dropdown */}
            <div className="relative hidden md:block">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setProfileDropdown(!profileDropdown);
                }}
                className="flex items-center space-x-2 p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">A</span>
                </div>
                <span className="text-sm font-medium">Admin</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    profileDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown */}
              {profileDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-800">
                      Administrator
                    </p>
                    <p className="text-xs text-gray-500">admin@iispr.com</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile/Tablet Logout Button */}
            <button
              onClick={handleLogout}
              className="md:hidden flex items-center space-x-2 px-3 py-2 text-white bg-gradient-to-r from-red-500 to-red-600 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-200"
            >
              {menuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="py-2 space-y-1">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                      item.active
                        ? "bg-blue-50 text-blue-700 border-r-4 border-blue-500"
                        : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              {/* Mobile Profile Section */}
              <div className="px-4 py-3 border-t border-gray-200 mt-2">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">A</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      Administrator
                    </p>
                    <p className="text-xs text-gray-500">admin@iispr.com</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
