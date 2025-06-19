import "bootstrap-icons/font/bootstrap-icons.css";
import { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate, useLocation } from "react-router-dom";

const SideNav = () => {
  const { dashboard, setDashboard } = useAppContext();
  const [activeItem, setActiveItem] = useState(dashboard);
  const [content, setContent] = useState("Content for Home");
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const mainContent = document.getElementById("mainContent");
    const sidebar = document.getElementById("sidebar");

    // Sidebar hover effect
    const handleMouseEnter = () => {
      setIsExpanded(true);
      if (mainContent) mainContent.style.marginLeft = "16rem";
    };

    const handleMouseLeave = () => {
      setIsExpanded(false);
      if (mainContent) mainContent.style.marginLeft = "4rem";
    };

    if (sidebar) {
      sidebar.addEventListener("mouseenter", handleMouseEnter);
      sidebar.addEventListener("mouseleave", handleMouseLeave);
    }

    // Set active item based on current path
    const currentPath = location.pathname.substring(1);
    const matchedItem = menuItems.find(
      (item) => redirectURLs[item.id] === currentPath
    );
    if (matchedItem) {
      setActiveItem(matchedItem.name);
      setDashboard(matchedItem.name);
    }

    // Cleanup event listeners
    return () => {
      if (sidebar) {
        sidebar.removeEventListener("mouseenter", handleMouseEnter);
        sidebar.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [location.pathname, setDashboard]);

  // Menu items
  const menuItems = [
    { id: 0, name: "Home", icon: "bi-house" },
    { id: 1, name: "Batch", icon: "bi-grid" },
    { id: 2, name: "Projects", icon: "bi-people" },
	{ id: 3, name: "Rankings", icon: "bi-trophy" },
    { id: 4, name: "Setting", icon: "bi-gear" },
    { id: 5, name: "Help", icon: "bi-question-circle" }
  ];

  const redirectURLs = ["", "batch-dashboard", "projects","intern-rankings", "reports", "Setting", "help", "AskHR"];

  const footerItems = [{ name: "Log Out", icon: "bi-box-arrow-left" }];

  // Handle menu click
  const handleMenuClick = (item) => {
    setActiveItem(item);
    setDashboard(item);
    setContent(`Content for ${item}`);
  };

  const handleLogOut = () => {
    navigate("/logout");
  };

  return (
    <div className="flex sidenavbar">
      {/* SideNav */}
      <div
        id="sidebar"
        className={`bg-gradient-to-b from-blue-600 to-blue-700 h-screen fixed sidenav-container ${
          isExpanded ? "w-64" : "w-16"
        } duration-300 text-white flex flex-col justify-between shadow-lg z-50`}
      >
        {/* Logo/Brand section */}
        <div className="mt-6 mb-8 flex justify-center">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm">
            <i className="bi bi-layers text-xl text-white"></i>
          </div>
        </div>

        {/* SideNav Items */}
        <div className="flex-1 overflow-y-auto">
          <ul className="px-2 space-y-1">
            {menuItems.map((item) => {
              const isActive = activeItem === item.name;
              return (
                <li
                  key={item.name}
                  onClick={() => {
                    handleMenuClick(item.name);
                    navigate(`/${redirectURLs[item.id]}`);
                  }}
                  className={`flex items-center py-3 px-3 cursor-pointer rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-white/10 text-white shadow-sm"
                      : "text-blue-100 hover:bg-white/5"
                  }`}
                >
                  <div className="relative flex items-center">
                    {isActive && (
                      <div className="absolute -left-3 w-1 h-6 bg-white rounded-full"></div>
                    )}
                    <i
                      className={`bi ${item.icon} text-lg ${
                        isActive ? "text-white" : "text-blue-100"
                      }`}
                    ></i>
                    <span
                      className={`ml-4 text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                        isExpanded
                          ? "opacity-100 translate-x-0"
                          : "opacity-0 -translate-x-10 hidden"
                      }`}
                    >
                      {item.name}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Divider */}
        <div
          className={`mx-4 my-4 border-t border-blue-400/30 ${
            isExpanded ? "block" : "hidden"
          }`}
        ></div>

        {/* Footer Items */}
        <div className="mb-6 px-2">
          <ul className="space-y-1">
            {footerItems.map((item) => (
              <li
                key={item.name}
                onClick={
                  item.name === "Log Out"
                    ? handleLogOut
                    : () => handleMenuClick(item.name)
                }
                className="flex items-center py-3 px-3 hover:bg-white/5 cursor-pointer rounded-lg transition-all duration-200 text-blue-100 hover:text-white"
              >
                <i className={`bi ${item.icon} text-lg`}></i>
                <span
                  className={`ml-4 text-sm whitespace-nowrap transition-all duration-200 ${
                    isExpanded
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-10 hidden"
                  }`}
                >
                  {item.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mobile Menu Button - Visible only on small screens */}
      <button
        className="fixed bottom-6 right-6 lg:hidden z-50 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <i className={`bi ${isExpanded ? "bi-x" : "bi-list"} text-xl`}></i>
      </button>
    </div>
  );
};

export default SideNav;
