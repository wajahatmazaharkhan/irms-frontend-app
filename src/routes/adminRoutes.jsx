import {
  AdminHomePage,
  AdminProject,
  AdminReport,
  AdminHelpPage,
  InternAttendance,
  AdminNotify,
  AdminTask,
  AllAttendance,
  AdminHRManagement,
  UserManagement,
  AdminGuidePage,
} from "@/Admin";

import { InternTasksSubmissions } from "@/Admin";
import HRInternsListPage from "@/HrHeadAndIntern/HRInternsListPage";

import { AllUsers, Internleaveapplication } from "@/Pages";

export const adminRoutes = [
  { path: "/admin-access", element: <AdminHomePage /> },
  { path: "/Projectmanagement", element: <AdminProject /> },
  { path: "/Weeklyreport", element: <AdminReport /> },
  { path: "/Admintask", element: <AdminTask /> },
  { path: "/Taskassignment", element: <AdminTask /> },
  { path: "/allusers", element: <AllUsers /> },
  { path: "/adminhelppage", element: <AdminHelpPage /> },
  { path: "/intern-attendance", element: <InternAttendance /> },
  { path: "/interntasksubmissions", element: <InternTasksSubmissions /> },
  { path: "/view-attendance-all", element: <AllAttendance /> },
  { path: "/notify-all", element: <AdminNotify /> },
  { path: "/admin-hr-management", element: <AdminHRManagement /> },
  { path: "/user-management", element: <UserManagement /> },
  { path: "/admin-guide", element: <AdminGuidePage /> },
  {
    path: "/Internleaveapplications",
    element: <Internleaveapplication mode="admin" />,
  },
  {path:"/hrinterns/:id", element: <HRInternsListPage />
    }
];
