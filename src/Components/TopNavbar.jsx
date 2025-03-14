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
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAppContext } from "@/context/AppContext.jsx";
import { NotiBadge } from "./compIndex.js";
import { useAuthContext } from "@/context/AuthContext.jsx";

const TopNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { notiCounter, setNotiCounter } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { loggedIn } = useAuthContext();
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  const availableRoutes = [
    // Public Routes
    { path: "/login", label: "Login", public: true },
    { path: "/signup", label: "Sign Up", public: true },
    { path: "/aboutus", label: "About Us", public: true },
    { path: "/privacypolicy", label: "Privacy Policy", public: true },
    { path: "/frequently-asked-questions", label: "FAQ", public: true },

    // Protected User Routes
    { path: "/", label: "Home", public: false },
    { path: "/dashboard", label: "Dashboard", public: false },
    { path: "/your-profile", label: "Profile", public: false },
    { path: "/notifications", label: "Notifications", public: false },
    { path: "/reports", label: "Reports", public: false },
    { path: "/projects", label: "Projects", public: false },
    { path: "/help", label: "Help", public: false },
    { path: "/my-attendance", label: "My Attendance", public: false },
    { path: "/stores", label: "Stores", public: false },
    { path: "/leave-application", label: "Leave Application", public: false },
    { path: "/setting", label: "Settings", public: false },
    { path: "/help-request", label: "Harassment Form", public: false },

    // Admin Routes
    { path: "/adminhomepage", label: "Admin Dashboard", adminOnly: true },
    {
      path: "/projectmanagement",
      label: "Project Management",
      adminOnly: true,
    },
    { path: "/admintask", label: "Admin Tasks", adminOnly: true },
    { path: "/weeklyreport", label: "Weekly Reports", adminOnly: true },
    { path: "/allusers", label: "All Users", adminOnly: true },
    { path: "/intern-attendance", label: "Intern Attendance", adminOnly: true },
    {
      path: "/view-attendance-all",
      label: "View All Attendance",
      adminOnly: true,
    },
  ];

  const filteredRoutes = availableRoutes.filter((route) => {
    if (!loggedIn) return route.public;
    if (isAdmin) return true;
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
      label: "Have a Query",
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
      path: "/setting",
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
    ...(isAdmin
      ? [
          {
            label: "Admin Panel",
            path: "/adminhomepage",
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

  useEffect(() => {
    if (loggedIn) {
      const fetchNotifications = async () => {
        const userId = localStorage.getItem("userId");
        try {
          const response = await fetch(
            `https://iisppr-backend.vercel.app/get-notifications?userId=${userId}`
          );
          if (!response.ok) throw new Error("Failed to fetch notifications");
          const data = await response.json();
          setNotiCounter(data.notifications.notifications.length);
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      };
      fetchNotifications();
    }
  }, [loggedIn]);

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
    <div className="sticky top-0 z-50 bg-white shadow-md">
      <div className="flex items-center justify-between p-4 border-b relative">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between w-full">
          <button
            className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 rounded-md p-1 transition-colors"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
          >
            <Menu className="w-6 h-6" />
          </button>

          <Link to="/" className="flex items-center">
            <div className="flex flex-row items-center">
              <Building2 className="w-6 h-6 text-blue-600" />
              <span className="text-lg font-semibold ml-2 text-gray-800">
                IISPPR Intern Hub
              </span>
            </div>
          </Link>

          <div className="flex items-center space-x-2">
            {loggedIn && <NotiBadge count={notiCounter} />}
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 rounded-md p-1 transition-colors"
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

        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between w-full">
          <Link to="/" className="flex items-center group">
            <div className="flex flex-row items-center">
              <Building2 className="w-6 h-6 text-blue-600 group-hover:text-blue-700 transition-colors" />
              <span className="text-lg font-semibold ml-2 text-gray-800 group-hover:text-black transition-colors">
                IISPPR Intern Hub
              </span>
            </div>
          </Link>

          <div className="relative w-1/3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search pages..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              />
            </div>

            {searchResults.length > 0 && (
              <div className="absolute w-full mt-1 bg-white border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                {searchResults.map((result) => (
                  <div
                    key={result.path}
                    onClick={() => {
                      navigate(result.path);
                      setSearchQuery("");
                      setSearchResults([]);
                    }}
                    className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors flex items-center"
                  >
                    <div className="w-1 h-6 bg-blue-500 rounded-full mr-3 opacity-0 hover:opacity-100 transition-opacity"></div>
                    {result.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-5">
            {loggedIn && (
              <div className="relative">
                <Link
                  to="/notifications"
                  className="relative p-2 rounded-full transition-colors"
                >
                  <Bell className="w-5 h-5 text-gray-600" />
                  {notiCounter > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                      {notiCounter > 9 ? "9+" : notiCounter}
                    </span>
                  )}
                </Link>
              </div>
            )}

            {loggedIn ? (
              <div className="relative user-dropdown">
                <div
                  className="flex items-center space-x-2 cursor-pointer p-1 rounded-full hover:bg-gray-100 transition-colors"
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <UserRound className="w-5 h-5 text-blue-600" />
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg z-10 overflow-hidden">
                    <div className="p-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        User Menu
                      </p>
                      <p className="text-xs text-gray-500">
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
                              ? "text-red-500 mt-2 border-t border-gray-100"
                              : "text-gray-700"
                          }`}
                        >
                          <span className="mr-3 text-gray-500">
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
                  className="px-4 py-2 text-blue-600 border border-blue-600 hover:bg-blue-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
                  onClick={() => navigate("/signup")}
                >
                  Sign Up
                </Button>
                <Button
                  variant="primary"
                  className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search */}
        {isSearchVisible && (
          <div className="absolute top-full left-0 w-full p-3 bg-white border-b shadow-md md:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search pages..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                autoFocus
              />

              {searchResults.length > 0 && (
                <div className="absolute w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {searchResults.map((result) => (
                    <div
                      key={result.path}
                      onClick={() => {
                        navigate(result.path);
                        setSearchQuery("");
                        setSearchResults([]);
                        setIsSearchVisible(false);
                      }}
                      className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-0"
                    >
                      {result.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mobile Sidebar */}
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex">
            <div className="bg-white w-72 h-full shadow-lg flex flex-col">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center">
                  <Building2 className="w-6 h-6 text-blue-600" />
                  <span className="text-lg font-semibold ml-2 text-gray-800">
                    IISPPR Intern Hub
                  </span>
                </div>
                <button
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {loggedIn && (
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <UserRound className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Welcome</p>
                      <p className="text-sm text-gray-500">User Account</p>
                    </div>
                  </div>
                </div>
              )}

              <nav className="flex-1 overflow-y-auto p-2">
                <div className="space-y-1">
                  {filteredRoutes.map((route) => (
                    <Link
                      key={route.path}
                      to={route.path}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center px-4 py-3 hover:bg-blue-50 rounded-lg transition-colors ${
                        location.pathname === route.path
                          ? "bg-blue-50 text-blue-600 font-medium"
                          : "text-gray-700"
                      }`}
                    >
                      {location.pathname === route.path && (
                        <div className="w-1 h-5 bg-blue-500 rounded-full mr-3"></div>
                      )}
                      {route.label}
                    </Link>
                  ))}
                </div>
              </nav>

              {loggedIn && (
                <div className="p-4 border-t border-gray-200">
                  <Link
                    to="/logout"
                    onClick={() => setIsSidebarOpen(false)}
                    className="flex items-center text-red-500 px-4 py-2 hover:bg-red-50 rounded-lg transition-colors"
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
