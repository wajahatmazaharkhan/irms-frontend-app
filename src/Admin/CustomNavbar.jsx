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
import axios from "axios";
import Loader from "@/Components/Loader";

export default function CustomNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/auth/user/${localStorage.getItem(
          "userId"
        )}`
      );
      const data = response.data;
      setUserData(data);
      setIsLoading(false);
    } catch (error) {
      console.error(`Error fetching user details: ${error}`);
      setIsLoading(false);
    }
  };

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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        await fetchUser();
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  const navigationItemsHR = [
    {
      name: "Home",
      path: "/admin-access",
      icon: Home,
      active: location.pathname === "/HrHomepage",
    },
    {
      name: "Project Management",
      path: "/hrprojects",
      icon: FolderOpen,
      active: location.pathname === "/Projectmanagement",
    },
    {
      name: "Weekly Report",
      path: "/hrreports",
      icon: FileText,
      active: location.pathname === "/Weeklyreport",
    },
    {
      name: "Task Assignment",
      path: "/hrtaskassignment",
      icon: CheckSquare,
      active: location.pathname === "/Taskassignment",
    },
  ];

  const navigationItemsAdmin = [
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

  const NavbarSkeleton = () => (
    <nav className="bg-white dark:bg-gray-900 shadow-lg dark:shadow-none border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title Skeleton */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-nonelg animate-pulse"></div>
            <div className="hidden sm:block w-32 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>

          {/* Navigation Items Skeleton */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-24 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
              ></div>
            ))}
          </div>

          {/* Profile Skeleton */}
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-nonefull animate-pulse"></div>
          </div>
        </div>
      </div>
    </nav>
  );

  if (isLoading) return <NavbarSkeleton />;
  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg dark:shadow-none border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
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
                {userData.role === "admin"
                  ? "Admin"
                  : userData.role === "hrHead"
                  ? "HR Head"
                  : "HR"}{" "}
                Portal
              </h1>
            </div>
          </div>
          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-1">
            {(userData.role === "admin" || userData.role === "hrHead"
              ? navigationItemsAdmin
              : navigationItemsHR
            ).map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-nonelg text-sm font-medium transition-all duration-200 ${
                    item.active
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 shadow-sm"
                      : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800"
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
            {/* Profile Dropdown */}
            <div className="relative hidden md:block">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setProfileDropdown(!profileDropdown);
                }}
                className="flex items-center space-x-2 p-2 rounded-nonelg text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-nonefull flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {userData.role[0].toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium">
                  {userData.role === "admin"
                    ? "Admin"
                    : userData.role === "hrHead"
                    ? "HR Head"
                    : "HR"}
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    profileDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown */}
              {profileDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-nonexl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                      {userData.role === "admin"
                        ? "Administrator"
                        : "Human Resource"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {userData.email}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors duration-200"
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
              className="md:hidden flex items-center space-x-2 px-3 py-2 text-white bg-gradient-to-r from-red-500 to-red-600 rounded-nonelg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 rounded-nonelg text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
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
          <div className="lg:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <div className="py-2 space-y-1">
              {(userData.role == "admin"
                ? navigationItemsAdmin
                : navigationItemsHR
              ).map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                      item.active
                        ? "bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200 border-r-4 border-blue-500"
                        : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              {/* Mobile Profile Section */}
              <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 mt-2">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-nonefull flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {userData.role[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                      {userData.role === "admin"
                        ? "Administrator"
                        : "Human Resource"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {userData.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-nonelg transition-colors duration-200"
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