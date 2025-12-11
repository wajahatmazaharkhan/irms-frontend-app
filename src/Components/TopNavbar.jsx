// TopNavbar.jsx
import { useState, useEffect } from "react";
import { Button } from "@/Components/ui/button.jsx";
import {
  Menu,
  Search,
  X,
  UserRound,
  ChevronDown,
  Building2,
  Bell,
  Home,
  Users,
  Trophy,
  Settings as SettingsIcon,
  HelpCircle,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAppContext } from "@/context/AppContext.jsx";
import { NotiBadge } from "./compIndex.js";
import { useAuthContext } from "@/context/AuthContext.jsx";

const TopNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // App context
  const { notiCounter, setNotiCounter, dashboard, setDashboard } =
    useAppContext();
  const { loggedIn } = useAuthContext();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // mobile drawer

  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const isHr = localStorage.getItem("isHr") === "true";
  const isIntern = !(isAdmin || isHr);

  // 🔹 Main nav (merged from old SideNav)
  const mainNavItems = [
    {
      label: "Home",
      path: "/",
      icon: <Home className="w-4 h-4" />,
    },
    {
      label: "Projects",
      path: "/projects",
      icon: <Users className="w-4 h-4" />,
    },
    {
      label: "Rankings",
      path: "/intern-rankings",
      icon: <Trophy className="w-4 h-4" />,
    },
    {
      label: "Settings",
      path: "/settings",
      icon: <SettingsIcon className="w-4 h-4" />,
    },
    {
      label: "Help",
      path: "/help",
      icon: <HelpCircle className="w-4 h-4" />,
    },
  ];

  // 🔹 All available routes for search and mobile drawer
  const availableRoutes = [
    { path: "/aboutus", label: "About Us", public: true },
    { path: "/privacypolicy", label: "Privacy Policy", public: true },
    { path: "/frequently-asked-questions", label: "FAQ", public: true },

    // Protected User Routes
    // { path: "/", label: "Home", public: false },
    // { path: "/dashboard", label: "Dashboard", public: false },
    { path: "/your-profile", label: "Profile", public: false },
    { path: "/notifications", label: "Notifications", public: false },
    { path: "/reports", label: "Reports", public: false },
    { path: "/projects", label: "Projects", public: false },
    { path: "/help", label: "Help", public: false },
    { path: "/my-attendance", label: "Attendance", public: false },
    { path: "/stores", label: "Stores", public: false },
    { path: "/settings", label: "Settings", public: false },
    { path: "/leave-application", label: "Leave Application", public: false },
    { path: "/help-request", label: "Harassment Form", public: false },

    // Admin Routes
    { path: "/admin-access", label: "Admin Dashboard", adminOnly: true },
    {
      path: "/projectmanagement",
      label: "Project Management",
      adminOnly: true,
    },
    { path: "/admintask", label: "Admin Tasks", adminOnly: true },
    { path: "/weeklyreport", label: "Weekly Reports", adminOnly: true },
    { path: "/allusers", label: "All Users", adminOnly: true },
    {
      path: "/intern-attendance",
      label: "Intern Attendance",
      adminOnly: true,
    },
    {
      path: "/view-attendance-all",
      label: "View All Attendance",
      adminOnly: true,
    },

    // HR Routes
    { path: "/hrhomepage", label: "HR Dashboard", hrOnly: true },
    // from old SideNav
    { path: "/intern-rankings", label: "Rankings", public: false },
  ];

  const filteredRoutes = availableRoutes.filter((route) => {
    if (!loggedIn) return route.public;
    if (isAdmin) return true;
    if (isHr) return true;
    return !route.adminOnly;
  });

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      const filtered = filteredRoutes.filter((route) =>
        route.label.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  };

  const dropdownOptions = [
    {
      label: "Your Profile",
      path: "/your-profile",
      icon: <UserRound className="w-4 h-4" />,
    },
    {
      label: "Your Attendance",
      path: "/my-attendance",
      icon: (
        <svg
          className="w-4 h-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
    },
    {
      label: "Harassment Form",
      path: "/help-request",
      icon: (
        <svg
          className="w-4 h-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      ),
    },
    {
      label: "Leave Application",
      path: "/leave-application",
      icon: (
        <svg
          className="w-4 h-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      label: "Settings",
      path: "/settings",
      icon: (
        <svg
          className="w-4 h-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
    {
      label: "FAQs",
      path: "/frequently-asked-questions",
      icon: (
        <svg
          className="w-4 h-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    ...(isIntern
      ? [
          {
            label: "Help",
            path: "/internticket",
            icon: <Building2 className="w-4 h-4" />,
          },
        ]
      : []),
    ...(isHr
      ? [
          {
            label: "HR Panel",
            path: "/hrhomepage",
            icon: <Building2 className="w-4 h-4" />,
          },
        ]
      : []),
    ...(isAdmin
      ? [
          {
            label: "Admin Panel",
            path: "/admin-access",
            icon: <Building2 className="w-4 h-4" />,
          },
        ]
      : []),
    {
      label: "Logout",
      path: "/logout",
      icon: (
        <svg
          className="w-4 h-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
      ),
    },
  ];

  // Fetch notifications
  useEffect(() => {
    if (loggedIn) {
      const fetchNotifications = async () => {
        const userId = localStorage.getItem("userId");
        const reqBody = { userId: userId };
        try {
          const response = await fetch(
            `${import.meta.env.VITE_BASE_URL}/get-notifications`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(reqBody),
            }
          );
          console.log("🚀 ~ fetchNotifications ~ response:", response);
          if (!response.ok) throw new Error("Failed to fetch notifications");
          const data = await response.json();
          setNotiCounter(data.notifications.notifications.length);
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      };
      fetchNotifications();
    }
  }, [loggedIn, setNotiCounter]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest(".user-dropdown")) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-100 dark:bg-slate-900 dark:text-slate-100 dark:shadow-lg dark:border-slate-800">
      <div className="flex items-center justify-between p-4 border-b relative border-gray-100 dark:border-slate-800">
        {/* 📱 Mobile Header */}
        <div className="md:hidden flex items-center justify-between w-full">
          <button
            className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 rounded-nonemd p-1 transition-colors dark:text-gray-300 dark:hover:text-white"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
          >
            <Menu className="w-6 h-6" />
          </button>

          <Link to="/" className="flex items-center">
            <div className="flex flex-row items-center">
              <span className="text-lg font-semibold ml-2 text-gray-800 dark:text-slate-100">
                IISPPR
              </span>
            </div>
          </Link>

          <div className="flex items-center space-x-2">
            {loggedIn && <NotiBadge count={notiCounter} />}
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 rounded-nonemd p-1 transition-colors dark:text-gray-300 dark:hover:text-white"
              onClick={() => setIsSearchVisible(!isSearchVisible)}
            >
              {!isSearchVisible ? (
                <Search className="h-5 w-5" />
              ) : (
                <X className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* 🖥️ Desktop Header */}
        <div className="hidden md:flex items-center justify-between w-full gap-6">
          {/* Logo + main nav */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center group">
              <div className="flex flex-row items-center">
                <span className="text-lg font-semibold ml-2 text-gray-800 group-hover:text-black transition-colors dark:text-slate-100 dark:group-hover:text-white">
                  IISPPR
                </span>
              </div>
            </Link>

            {/* 🔹 Main top nav (merged from SideNav) */}
            <nav className="hidden lg:flex items-center space-x-1">
              {mainNavItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      if (setDashboard) setDashboard(item.label);
                      navigate(item.path);
                    }}
                    className={`flex items-center px-3 py-2 rounded-nonelg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-600 dark:bg-slate-800 dark:text-blue-400"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Search */}
          <div className="relative w-1/3 min-w-[220px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search pages..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-nonefull focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white text-gray-900 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-400"
              />
            </div>

            {searchResults.length > 0 && (
              <div className="absolute w-full mt-1 bg-white border rounded-nonelg shadow-lg z-50 max-h-80 overflow-y-auto dark:bg-slate-800 dark:border-slate-700">
                {searchResults.map((result) => (
                  <div
                    key={result.path}
                    onClick={() => {
                      navigate(result.path);
                      setSearchQuery("");
                      setSearchResults([]);
                    }}
                    className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors flex items-center dark:hover:bg-slate-700 dark:text-slate-100"
                  >
                    <div className="w-1 h-6 bg-blue-500 rounded-nonefull mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    {result.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right side: notifications + user menu / auth buttons */}
          <div className="flex items-center space-x-5">
            {loggedIn && (
              <div className="relative">
                {/* Tight wrapper: inline-flex so absolute badge anchors to icon box */}
                <Link
                  to="/notifications"
                  className="relative inline-flex items-center justify-center p-2 rounded-full transition-colors"
                  aria-label={`Notifications (${notiCounter})`}
                >
                  {/* Icon (same size as mobile NotiBadge) */}
                  <Bell className="w-5 h-5 text-gray-600 dark:text-slate-200" />

                  {/* Badge anchored to the wrapper's top-right, slightly outside */}
                  {notiCounter > 0 && (
                    <>
                      <span
                        className="absolute -top-1 -right-5 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full"
                        aria-hidden="true"
                      >
                        {notiCounter > 9 ? "9+" : notiCounter}
                      </span>
                      {/* optional ping behind number */}
                      <span
                        className="absolute -top-1 -right-5 rounded-full w-5 h-5 animate-ping opacity-75 bg-red-500"
                        aria-hidden="true"
                      />
                    </>
                  )}
                </Link>
              </div>
            )}

            {loggedIn ? (
              <div className="relative user-dropdown">
                <div
                  className="flex items-center space-x-2 cursor-pointer p-1 rounded-nonefull hover:bg-gray-100 transition-colors dark:hover:bg-slate-800"
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                >
                  <div className="w-8 h-8 rounded-nonefull bg-blue-100 flex items-center justify-center dark:bg-blue-900">
                    <UserRound className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : ""
                    } dark:text-gray-300`}
                  />
                </div>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border rounded-nonelg shadow-lg z-10 overflow-hidden dark:bg-slate-800 dark:border-slate-700">
                    <div className="p-3 border-b border-gray-100 dark:border-slate-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-slate-100">
                        User Menu
                      </p>
                      <p className="text-xs text-gray-500 dark:text-slate-400">
                        Manage your account
                      </p>
                    </div>
                    <div className="py-1">
                      {dropdownOptions.map((option, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            navigate(option.path);
                            setIsDropdownOpen(false);
                          }}
                          className={`flex items-center px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors ${
                            option.label === "Logout"
                              ? "text-red-500 mt-2 border-t border-gray-100 dark:border-slate-700 dark:hover:bg-red-950"
                              : "text-gray-700 dark:text-slate-100 dark:hover:bg-slate-700"
                          }`}
                        >
                          <span className="mr-3 text-gray-500 dark:text-slate-300">
                            {option.icon}
                          </span>
                          {option.label}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  className="px-4 py-2 text-blue-600 border border-blue-600 hover:bg-blue-50 rounded-nonelg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors dark:text-blue-300 dark:border-blue-400 dark:hover:bg-slate-800"
                  onClick={() => navigate("/signup")}
                >
                  Sign Up
                </Button>
                <Button
                  variant="primary"
                  className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-nonelg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors dark:bg-blue-500 dark:hover:bg-blue-400"
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* 📱 Mobile Search dropdown */}
        {isSearchVisible && (
          <div className="absolute top-full left-0 w-full p-3 bg-white border-b shadow-md md:hidden dark:bg-slate-900 dark:border-slate-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search pages..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-nonelg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-400"
                autoFocus
              />

              {searchResults.length > 0 && (
                <div className="absolute w-full mt-1 bg-white border rounded-nonelg shadow-lg max-h-60 overflow-y-auto dark:bg-slate-800 dark:border-slate-700">
                  {searchResults.map((result) => (
                    <div
                      key={result.path}
                      onClick={() => {
                        navigate(result.path);
                        setSearchQuery("");
                        setSearchResults([]);
                        setIsSearchVisible(false);
                      }}
                      className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-0 dark:hover:bg-slate-700 dark:border-slate-700 dark:text-slate-100"
                    >
                      {result.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 📱 Mobile Drawer (menu) */}
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex md:hidden">
            <div className="bg-white w-72 h-full shadow-lg flex flex-col dark:bg-slate-900 dark:border-r dark:border-slate-800">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between dark:border-slate-800">
                <div className="flex items-center">
                  <span className="text-lg font-semibold ml-2 text-gray-800 dark:text-slate-100">
                    IISPPR | Intern Resource Management
                  </span>
                </div>
                <button
                  className="text-gray-500 hover:text-gray-700 focus:outline-none dark:text-gray-300 dark:hover:text-white"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {loggedIn && (
                <div className="p-4 border-b border-gray-200 dark:border-slate-800">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-nonefull bg-blue-100 flex items-center justify-center dark:bg-blue-900">
                      <UserRound className="w-6 h-6 text-blue-600 dark:text-blue-300" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-slate-100">
                        Welcome
                      </p>
                      <p
                        onClick={() => navigate("/your-profile")}
                        className="text-sm text-gray-500 dark:text-slate-400"
                      >
                        Your Account
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <nav className="flex-1 overflow-y-auto p-2">
                <div className="space-y-1">
                  {/* Main nav items first (like old SideNav) */}
                  {mainNavItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <button
                        key={item.path}
                        onClick={() => {
                          if (setDashboard) setDashboard(item.label);
                          navigate(item.path);
                          setIsSidebarOpen(false);
                        }}
                        className={`w-full flex items-center px-4 py-3 rounded-nonelg text-left transition-colors ${
                          isActive
                            ? "bg-blue-50 text-blue-600 font-medium dark:bg-slate-800 dark:text-blue-400"
                            : "text-gray-700 dark:text-slate-100 hover:bg-blue-50 dark:hover:bg-slate-800"
                        }`}
                      >
                        <span className="mr-3">{item.icon}</span>
                        <span>{item.label}</span>
                      </button>
                    );
                  })}

                  {/* Divider */}
                  <div className="my-3 border-t border-gray-200 dark:border-slate-800" />

                  {/* All other routes (searchable items) */}
                  {filteredRoutes.map((route) => (
                    <Link
                      key={route.path}
                      to={route.path}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center px-4 py-3 hover:bg-blue-50 rounded-nonelg transition-colors ${
                        location.pathname === route.path
                          ? "bg-blue-50 text-blue-600 font-medium dark:bg-slate-800 dark:text-blue-400"
                          : "text-gray-700 dark:text-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      {route.label}
                    </Link>
                  ))}
                </div>
              </nav>

              {loggedIn && (
                <div className="p-4 border-t border-gray-200 dark:border-slate-800">
                  <Link
                    to="/logout"
                    onClick={() => setIsSidebarOpen(false)}
                    className="flex items-center text-red-500 px-4 py-2 hover:bg-red-50 rounded-nonelg transition-colors dark:hover:bg-red-950"
                  >
                    <svg
                      className="w-5 h-5 mr-3"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Logout
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopNavbar;
