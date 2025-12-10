import CustomNavbar from "./CustomNavbar";
import { Link } from "react-router-dom";
import useTitle from "@/Components/useTitle";
import {
  Users,
  Calendar,
  FileText,
  HelpCircle,
  CheckSquare,
  FolderOpen,
  Bell,
  Settings,
  TrendingUp,
  Activity,
  Clock,
  CalendarCheck2,
  UserCheck,
  ComputerIcon,
  TrendingDown,
  LineChartIcon,
  Settings2,
} from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

function AdminHomePage() {
  useTitle("IRMS | Admin Dashboard");
  const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");
  const [uptime, setUptime] = useState("");

  const getProcessUptime = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/uptime`);
      console.log("🚀 ~ getProcessUptime ~ res:", res);
      setUptime(res.data.upTime);
    } catch (error) {
      console.log("🚀 ~ getProcessUptime ~ error:", error);
    }
  };

  useEffect(() => {
    getProcessUptime();
  }, []);

  const dashboardStats = [
    {
      icon: uptime ? LineChartIcon : TrendingDown,
      label: "Performance",
      value: uptime ? "Excellent" : "Normal",
      color: "text-green-600 dark:text-green-400",
    },
    {
      icon: ComputerIcon,
      label: "Server Status",
      value: uptime ? "Active" : "Inactive",
      color: uptime ? "text-blue-600 dark:text-blue-400" : "text-red-600 dark:text-red-400",
    },
    {
      icon: Clock,
      label: "Uptime",
      value: uptime,
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      icon: Activity,
      label: "System Status",
      value: "Stable",
      color: "text-orange-600 dark:text-orange-400",
    },
  ];

  const navigationCards = [
    {
      title: "All Users",
      route: "/allusers",
      icon: Users,
      description: "Manage all system users",
      gradient: "from-blue-500 to-blue-700",
      permission: "user_management",
    },
    {
      title: "Intern Attendance",
      route: "/intern-attendance",
      icon: Calendar,
      description: "Track intern attendance",
      gradient: "from-green-500 to-green-700",
      permission: "attendance",
    },
    {
      title: "Leave Applications",
      route: "/Internleaveapplications",
      icon: FileText,
      description: "Review leave requests",
      gradient: "from-purple-500 to-purple-700",
      permission: "leave_approval",
    },
    {
      title: "Help",
      route: "/adminhelppage",
      icon: HelpCircle,
      description: "Admin support center",
      gradient: "from-indigo-500 to-indigo-700",
      permission: null, // No permission required
    },
    {
      title: "Task Submissions",
      route: "/interntasksubmissions",
      icon: CheckSquare,
      description: "Review task submissions",
      gradient: "from-teal-500 to-teal-700",
      permission: "reports",
    },
    {
      title: "Projects",
      route: "/Projectmanagement",
      icon: FolderOpen,
      description: "Manage projects",
      gradient: "from-orange-500 to-orange-700",
    },
    {
      title: "Send Notifications",
      route: "/notify-all",
      icon: Bell,
      description: "Broadcast notifications",
      gradient: "from-red-500 to-red-700",
      permission: "notifications",
    },
    // {

    //   title: "Admin & HR System",
    //   route: "/admin-hr-management",
    //   icon: Settings,
    //   description: "System administration",
    //   gradient: "from-gray-500 to-gray-700",
    //   permission: "system_settings",
    // },
    {
      title: "Batch Management",
      route: "/batch-management",
      icon: CalendarCheck2,
      description: "System administration",
      gradient: "from-yellow-500 to-yellow-700",
      permission: "data_export",
    },
    {
      title: "User Management",
      route: "/user-management",
      icon: UserCheck,
      description: "Manage user roles and permissions",
      gradient: "from-pink-500 to-pink-700",
      permission: "user_management",
    },
    {
      title: "Intern Ranklist",
      route: "/intern-rankings",
      icon: TrendingUp,
      description: "View intern rankings and performance",
      gradient: "from-cyan-500 to-cyan-700",
    },
     {
      title: "Settings",
      route: "/settings",
      icon: Settings,
      description: "Dark Mode | Update Password",
      gradient: "from-gray-500 to-gray-700",
    },
  ];

  return (
    <>
      <CustomNavbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
        <div className="container mx-auto p-6">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              Welcome Admin
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Manage your system efficiently with our comprehensive dashboard
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {dashboardStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-900 rounded-nonexl shadow-md dark:shadow-none p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                        {stat.label}
                      </p>
                      <p className={`text-2xl font-bold ${stat.color}`}>
                        {stat.value}
                      </p>
                    </div>
                    <div className="p-3 rounded-nonefull bg-gray-100 dark:bg-gray-800">
                      <IconComponent className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {navigationCards.map((card, index) => {
              const IconComponent = card.icon;
              const allowed =
                !card.permission || permissions.includes(card.permission);

              return (
                <div
                  key={index}
                  className="group relative"
                  // style={{ pointerEvents: allowed ? "auto" : "none" }}
                >
                  <Link
                    to={allowed ? card.route : "#"}
                    tabIndex={allowed ? 0 : -1}
                  >
                    <div
                      className={`bg-gradient-to-br ${
                        card.gradient
                      } rounded-none shadow-lg p-6 text-white hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ${
                        !allowed ? "opacity-80 cursor-not-allowed" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <IconComponent className="w-8 h-8" />
                        <div className="w-2 h-2 bg-white rounded-full opacity-70"></div>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">
                        {card.title}
                      </h3>
                      <p className="text-sm opacity-90">{card.description}</p>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Quick Actions Section */}
          <div className="mt-12 bg-white dark:bg-gray-900 rounded-nonexl shadow-md dark:shadow-none p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 rounded-nonelg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-950 border border-blue-200 dark:border-blue-700">
                <Users className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  User Management
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Efficiently manage all system users and their permissions
                </p>
              </div>
              <div className="text-center p-6 rounded-nonelg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-950 border border-green-200 dark:border-green-700">
                <Activity className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  System Monitoring
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Monitor system performance and user activities
                </p>
              </div>
              <div className="text-center p-6 rounded-nonelg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-950 border border-purple-200 dark:border-purple-700">
                <Bell className="w-12 h-12 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  Communications
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Send notifications and manage communications
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminHomePage;