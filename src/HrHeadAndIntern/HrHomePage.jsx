import CustomHrNavbar from "./CustomHrNavbar";
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
} from "lucide-react";

function AdminHomePage() {
  useTitle("HR Dashboard");

  const dashboardStats = [
    {
      icon: TrendingUp,
      label: "Performance",
      value: "Excellent",
      color: "text-green-600",
    },
    {
      icon: Activity,
      label: "System Status",
      value: "Active",
      color: "text-blue-600",
    },
    { icon: Clock, label: "Uptime", value: "99.9%", color: "text-purple-600" },
    {
      icon: UserCheck,
      label: "Active Users",
      value: "Online",
      color: "text-orange-600",
    },
  ];

  const navigationCards = [
    {
      title: "All Users",
      route: "/allhrusers",
      icon: Users,
      description: "Manage all system users",
      gradient: "from-blue-500 to-blue-700",
    },
    {
      title: "Intern Attendance",
      route: "/hrallattendance",
      icon: Calendar,
      description: "Track intern attendance",
      gradient: "from-green-500 to-green-700",
    },
    {
      title: "Leave Applications",
      route: "/internshrleaveapplications",
      icon: FileText,
      description: "Review leave requests",
      gradient: "from-purple-500 to-purple-700",
    },
    {
      title: "Help",
      route: "/hrhelp",
      icon: HelpCircle,
      description: "Admin support center",
      gradient: "from-indigo-500 to-indigo-700",
    },
    {
      title: "Task Submissions",
      route: "/hrtasksubmissions",
      icon: CheckSquare,
      description: "Review task submissions",
      gradient: "from-teal-500 to-teal-700",
    },
    {
      title: "Projects",
      route: "/hrprojects",
      icon: FolderOpen,
      description: "Manage projects",
      gradient: "from-orange-500 to-orange-700",
    },
    {
      title: "Send Notifications",
      route: "/hrnotify",
      icon: Bell,
      description: "Broadcast notifications",
      gradient: "from-red-500 to-red-700",
    },
    {
      title: "Intern System",
      route: "/hrinternsmgmt",
      icon: Settings,
      description: "System administration",
      gradient: "from-gray-500 to-gray-700",
    },
    {
      title: "Batch Management",
      route: "/hrbatchmgmt",
      icon: CalendarCheck2,
      description: "System administration",
      gradient: "from-yellow-500 to-yellow-700",
    },
  ];

  return (
    <>
      <CustomHrNavbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto p-6">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Welcome HR
            </h1>
            <p className="text-gray-600 text-lg">
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
                  className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        {stat.label}
                      </p>
                      <p className={`text-2xl font-bold ${stat.color}`}>
                        {stat.value}
                      </p>
                    </div>
                    <div className={`p-3 rounded-full bg-gray-100`}>
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
              return (
                <Link key={index} to={card.route} className="group">
                  <div
                    className={`bg-gradient-to-br ${card.gradient} rounded-xl shadow-lg p-6 text-white hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <IconComponent className="w-8 h-8" />
                      <div className="w-2 h-2 bg-white rounded-full opacity-70"></div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                    <p className="text-sm opacity-90">{card.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Quick Actions Section */}
          <div className="mt-12 bg-white rounded-xl shadow-md p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                <Users className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-800 mb-2">
                  User Management
                </h3>
                <p className="text-sm text-gray-600">
                  Efficiently manage all system users and their permissions
                </p>
              </div>
              <div className="text-center p-6 rounded-lg bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
                <Activity className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-800 mb-2">
                  System Monitoring
                </h3>
                <p className="text-sm text-gray-600">
                  Monitor system performance and user activities
                </p>
              </div>
              <div className="text-center p-6 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
                <Bell className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-800 mb-2">
                  Communications
                </h3>
                <p className="text-sm text-gray-600">
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
