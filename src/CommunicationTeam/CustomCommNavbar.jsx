/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import iisprLogo from "../assets/Images/iisprlogo.png";
import {
  Home,
  FolderOpen,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Trophy
} from "lucide-react";
import axios from "axios";

export default function CommNavbar() {
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
      setUserData(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error(`Error fetching user details: ${error}`);
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    sessionStorage.clear();
    navigate("/logout");
  };

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = () => setProfileDropdown(false);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchUser();
  }, []);

  const navigationItemsComm = [
    {
      name: "Dashboard", // ✅ Change name as needed
      path: "/commhomepage", // ✅ Your route
      icon: Home,
      active: location.pathname === "/commhomepage",
    },
    {
      name: "Manage Tickets", // ✅ Change name as needed
      path: "/commtickets", // ✅ Your route
      icon: FolderOpen,
      active: location.pathname === "/commtickets",
    },
    {
      name: "Rank",
      path: "/commrank",
      icon: Trophy,
      active: location.pathname === "/commrank",
    },
  ];

  const NavbarSkeleton = () => (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-nonelg animate-pulse"></div>
            <div className="hidden sm:block w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="w-24 h-8 bg-gray-200 rounded animate-pulse"
              ></div>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gray-200 rounded-nonefull animate-pulse"></div>
          </div>
        </div>
      </div>
    </nav>
  );

  if (isLoading) return <NavbarSkeleton />;

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img
              src={iisprLogo}
              alt="IISPR Logo"
              className="h-10 w-auto hover:scale-105 transition-transform"
            />
            <h1 className="hidden sm:block text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Comm Portal
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-1">
            {navigationItemsComm.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-nonelg text-sm font-medium transition-all duration-200 ${
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

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setProfileDropdown(!profileDropdown);
                }}
                className="flex items-center space-x-2 p-2 rounded-nonelg text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-nonefull flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">C</span>
                </div>
                <span className="text-sm font-medium">Comm</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    profileDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>
              {profileDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-nonexl shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-800">Comm Team</p>
                    <p className="text-xs text-gray-500">{userData.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Logout */}
            <button
              onClick={handleLogout}
              className="md:hidden flex items-center space-x-2 px-3 py-2 text-white bg-gradient-to-r from-red-500 to-red-600 rounded-nonelg hover:from-red-600 hover:to-red-700 transition shadow-md"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 rounded-nonelg text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="py-2 space-y-1">
              {navigationItemsComm.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-3 text-sm font-medium ${
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

              {/* Profile Mobile */}
              <div className="px-4 py-3 border-t border-gray-200 mt-2">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-nonefull flex items-center justify-center">
                    <span className="text-white font-semibold">C</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Comm Team</p>
                    <p className="text-xs text-gray-500">{userData.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-nonelg transition"
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
