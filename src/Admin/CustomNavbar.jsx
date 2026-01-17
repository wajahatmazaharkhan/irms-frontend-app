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
  User,
  Sun,
} from "lucide-react";
import { DarkMode } from "@mui/icons-material";
import axios from "axios";
import toast from "react-hot-toast";

export default function CustomNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  /* ---------------- THEME ---------------- */
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
    toast(theme === "light" ? "Dark Mode 🌙" : "Light Mode ☀️");
  };

  /* ---------------- FETCH USER ---------------- */
  const fetchUser = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/auth/user/${localStorage.getItem(
          "userId"
        )}`
      );
      setUserData(res.data);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching user", err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  /* ---------------- UI EFFECTS ---------------- */
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const close = () => setProfileOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    sessionStorage.clear();
    navigate("/logout");
  };

  /* ---------------- NAV ITEMS ---------------- */
  const themeToggleItem = {
    name: "",
    path: "",
    icon: theme === "light" ? DarkMode : Sun,
    isAction: true,
  };

  const adminNav = [
    { name: "Home", path: "/admin-access", icon: Home },
    { name: "User Management", path: "/user-management", icon: User },
    {
      name: "Project Management",
      path: "/Projectmanagement",
      icon: FolderOpen,
    },
    { name: "Weekly Report", path: "/Weeklyreport", icon: FileText },
    { name: "Task Assignment", path: "/Taskassignment", icon: CheckSquare },
    themeToggleItem,
  ];

  const hrNav = [
    { name: "Home", path: "/admin-access", icon: Home },
    { name: "Project Management", path: "/hrprojects", icon: FolderOpen },
    { name: "Weekly Report", path: "/hrreports", icon: FileText },
    { name: "Task Assignment", path: "/hrtaskassignment", icon: CheckSquare },
    themeToggleItem,
  ];

  if (isLoading) return null;

  const navItems =
    userData.role === "admin" || userData.role === "hrHead" ? adminNav : hrNav;

  /* ================= RENDER ================= */
  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* LOGO */}
          <div className="flex items-center space-x-3">
            <img src={iisprLogo} className="h-10" alt="Logo" />
            <h1 className="hidden sm:block font-bold text-lg text-blue-600">
              {userData.role === "admin"
                ? "Admin"
                : userData.role === "hrHead"
                ? "HR Head"
                : "HR"}{" "}
              Portal
            </h1>
          </div>

          {/* DESKTOP NAV */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={item.isAction ? toggleTheme : undefined}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3">
            {/* PROFILE AVATAR */}
            <div className="relative hidden md:block">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setProfileOpen((p) => !p);
                }}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {userData.role[0].toUpperCase()}
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* DROPDOWN */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg shadow-lg">
                  <div className="px-4 py-2 border-b dark:border-gray-700">
                    <p className="text-sm font-medium">
                      {userData.role === "admin"
                        ? "Administrator"
                        : "Human Resource"}
                    </p>
                    <p className="text-xs text-gray-500">{userData.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 text-gray-600 dark:text-gray-300"
            >
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="lg:hidden py-2 border-t dark:border-gray-700">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={item.isAction ? toggleTheme : undefined}
                  className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
