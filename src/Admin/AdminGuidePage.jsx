"use client";

import CustomNavbar from "./CustomNavbar";
import useTitle from "@/Components/useTitle";
import {
  Shield,
  Users,
  UserCheck,
  Crown,
  Briefcase,
  ClipboardList,
  CalendarCheck2,
  FileText,
  Bell,
  Settings,
  Activity,
  Repeat2,
  CheckCircle,
  Clock,
} from "lucide-react";

function AdminGuidePage() {
  useTitle("Admin Guide & Updates");

  const sections = [
    {
      title: "User Verification & Onboarding",
      icon: UserCheck,
      color: "from-blue-500 to-blue-700",
      points: [
        "All newly registered users appear under Pending Verification.",
        "Admins must manually verify users before system access is granted.",
        "Verified users are moved automatically to the main user list.",
        "Unverified users have no access to dashboard features.",
        "Admins can delete users permanently if required.",
      ],
    },
    {
      title: "Roles & Permission System",
      icon: Crown,
      color: "from-purple-500 to-purple-700",
      points: [
        "Admin: Full access to all modules including system settings and exports.",
        "HR Head: Same operational permissions as Admin except ownership actions.",
        "HR: Handles employees, attendance, leave approvals, and recruitment.",
        "Intern: Limited access to tasks, attendance, and submissions.",
        "Permissions can be manually customized per user.",
        "Reset to Role Defaults restores standard permissions instantly.",
      ],
    },
    {
      title: "Task & Project Management",
      icon: ClipboardList,
      color: "from-green-500 to-green-700",
      points: [
        "HR or admin can assign tasks to interns or teams.",
        "Each task supports deadlines, descriptions, and status tracking.",
        "Intern submissions can be reviewed and evaluated.",
        "Projects group multiple tasks for long-term tracking.",
        "Overdue and completed tasks are clearly indicated.",
      ],
    },
    {
      title: "Attendance & Leave Management",
      icon: CalendarCheck2,
      color: "from-yellow-500 to-yellow-700",
      points: [
        "Intern attendance is tracked via daily check-in/check-out.",
        "Admins can view attendance for all users.",
        "Leave requests can be approved or rejected.",
        "User activity status is calculated automatically.",
      ],
    },
    {
      title: "Reports, Notifications & System Control",
      icon: Bell,
      color: "from-red-500 to-red-700",
      points: [
        "Admins can send system-wide notifications.",
        "Reports provide insights into users, tasks, and attendance.",
        "Data export is available for audits and analysis.",
        "System settings control core platform behavior.",
      ],
    },
    {
      title: "Recent Platform Updates",
      icon: Repeat2,
      color: "from-indigo-500 to-indigo-700",
      points: [
        "Complete dark mode support across all admin pages.",
        "Improved user management security and self-lock prevention.",
        "Optimized pagination and faster table rendering.",
        "Enhanced UI accessibility, hover states, and responsiveness.",
        "Live server uptime and performance indicators added.",
      ],
    },
  ];

  return (
    <>
      <CustomNavbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
        <div className="container mx-auto p-6">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/40 rounded-full">
                <Shield className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              Admin Guide & System Updates
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Complete documentation of admin actions, workflows, and recent
              platform improvements
            </p>
          </div>

          {/* Guide Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-900 rounded-xl shadow-md dark:shadow-none border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  <div
                    className={`bg-gradient-to-br ${section.color} p-5 text-white`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-7 h-7" />
                      <h3 className="text-xl font-semibold">{section.title}</h3>
                    </div>
                  </div>
                  <div className="p-6 space-y-3">
                    {section.points.map((point, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 text-gray-700 dark:text-gray-300"
                      >
                        <CheckCircle className="w-4 h-4 mt-1 text-green-600 dark:text-green-400" />
                        <p className="text-sm leading-relaxed">{point}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Status */}
          <div className="mt-12 bg-white dark:bg-gray-900 rounded-xl shadow-md dark:shadow-none p-6 border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
              <span className="text-gray-800 dark:text-gray-100 font-semibold">
                System Status: Stable
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span className="text-gray-600 dark:text-gray-300 text-sm">
                Guide updated to latest platform version
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminGuidePage;
