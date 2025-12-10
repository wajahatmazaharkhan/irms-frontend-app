import { useEffect, useState } from "react";
import { Card, CardContent } from "@/Components/ui/card";
import { Navbar, useTitle } from "@/Components/compIndex";
import { Switch } from "@/Components/ui/switch";
import {
  Settings,
  User,
  HelpCircle,
  ExternalLink,
  Bell,
  Lock,
  Moon,
  Sun,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";

const SettingsPage = () => {
  useTitle("Settings");
  const navigate = useNavigate();
  const { setDashboard } = useAppContext();
  const [notifications] = useState(true);
  const [currentMode, setCurrentMode] = useState("");

  const menuItems = [
    {
      icon: <Bell size={24} />,
      label: "Notifications",
      description: "Manage your notification preferences",
      isToggle: true,
    },
    {
      icon: <User size={24} />,
      label: "Your Profile",
      path: "/your-profile",
      description: "Manage your personal information and preferences",
    },
    {
      icon: <Lock size={24} />,
      label: "Change Password",
      path: "/reset-account-password",
      description: "Update your account password securely",
    },
  ];

  const handleClick = (path) => {
    setDashboard(path.slice(1));
    navigate(path);
  };

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    // Optionally, save the user's preference in localStorage
    if (document.documentElement.classList.contains("dark")) {
      localStorage.setItem("theme", "dark");
      toast("Dark Mode 🌙");
    } else {
      localStorage.setItem("theme", "light");
      toast("Light Mode ☀️");
    }
    window.location.reload();
  };

  useEffect(() => {
    let current = localStorage.getItem("theme");
    setCurrentMode(current);
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-7xl mx-auto taskContainer sm:pl-8 md:pl-10 lg:pl-[10rem] text-gray-900 dark:bg-slate-950 dark:text-slate-100">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">Dashboard Settings</h1>
            <p className="text-gray-600 dark:text-slate-300">
              Manage your account preferences and settings
            </p>
          </div>
        </div>

        {/* Cards row with Notifications, Theme toggle (as a switch), Profile, Password */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Notifications Card (unchanged) */}
          {/* <Card className="hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-900 dark:border dark:border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-3 rounded-nonelg bg-blue-50 text-blue-600 dark:bg-slate-800 dark:text-blue-400">
                    <Bell size={24} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-100">
                      Notifications
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 dark:text-slate-400">
                      {notifications
                        ? "Notifications are enabled"
                        : "Notifications are disabled"}
                    </p>
                  </div>
                </div>
                <div
                  onClick={() =>
                    toast.error(
                      `Kindly contact the Admin to disable notifications.`
                    )
                  }
                >
                  <Switch
                    checked={notifications}
                    className="data-[state=checked]:bg-blue-600"
                  />
                </div>
              </div>
            </CardContent>
          </Card> */}

          {/* NEW: Dark Mode Toggle Card (using a Switch like Notifications) */}
          <Card className="hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-900 dark:border dark:border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-3 rounded-nonelg bg-blue-50 text-blue-600 dark:bg-slate-800 dark:text-blue-400">
                    {currentMode === "dark" ? (
                      <Sun size={24} />
                    ) : (
                      <Moon size={24} />
                    )}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-100">
                      Appearance
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 dark:text-slate-400 capitalize">
                      {`Switch to ${
                        currentMode === "dark" ? "light" : "dark"
                      } mode`}
                    </p>
                  </div>
                </div>
                <div onClick={toggleDarkMode}>
                  <Switch
                    checked={currentMode === "dark"}
                    className="data-[state=checked]:bg-blue-600"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Other settings cards (unchanged) */}
          {menuItems.slice(1).map((item) => (
            <Card
              key={item.path}
              className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer bg-white dark:bg-slate-900 dark:border dark:border-slate-700"
              onClick={() => handleClick(item.path)}
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-nonelg bg-blue-50 text-blue-600 dark:bg-slate-800 dark:text-blue-400">
                    {item.icon}
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-100">
                      {item.label}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 dark:text-slate-400">
                      {item.description}
                    </p>
                  </div>
                  <ExternalLink className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom cards: FAQs & Contact Us (Dark mode card removed here) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Card
            className="bg-blue-500 text-white cursor-pointer hover:bg-blue-600"
            onClick={() => navigate("/frequently-asked-questions")}
          >
            <CardContent className="p-6 flex items-center justify-center">
              <Settings className="h-8 w-8 mr-4" />
              <p className="text-xl font-semibold">FAQs</p>
            </CardContent>
          </Card>
          <Card
            className="bg-blue-500 text-white cursor-pointer hover:bg-blue-600"
            onClick={() => navigate("/help")}
          >
            <CardContent className="p-6 flex items-center justify-center">
              <HelpCircle className="h-8 w-8 mr-4" />
              <p className="text-xl font-semibold">Contact Us</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;