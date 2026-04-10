import {
  BatchDashboard,
  Profile,
  Notifications,
  Reports,
  Projects,
  Help,
  InternRankings,
  InternRaiseTicket,
  MyTickets,
  UserAttendance,
  Stores,
  LeaveApplication,
  SettingsPage,
  Logout,
  HarassmentEmailForm,
} from "@/Pages";

import InternTasksPage from "@/Components/InternTasks";
import ChatInterface from "../HrHeadAndIntern/InternChat";
import BatchManagement from "../Admin/BatchManagement";

export const userRoutes = [
  { path: "/", element: <BatchDashboard />},
  { path: "/dashboard", element: <BatchDashboard /> },
  { path: "/batch-dashboard", element: <BatchDashboard />, verified: true },
  { path: "/view-all-tasks", element: <InternTasksPage />, verified: true },
  { path: "/your-profile", element: <Profile />, verified: true },
  { path: "/notifications", element: <Notifications />, verified: true },
  { path: "/reports", element: <Reports />, verified: true },
  { path: "/projects", element: <Projects />, verified: true },
  { path: "/help", element: <Help /> },
  { path: "/intern-rankings", element: <InternRankings />, verified: true },
  { path: "/internticket", element: <InternRaiseTicket /> },
  { path: "/viewmytickets", element: <MyTickets /> },
  { path: "/internchat/:receiverId", element: <ChatInterface /> },
  { path: "/my-attendance", element: <UserAttendance />, verified: true },
  { path: "/stores", element: <Stores />, verified: true },
  { path: "/leave-application", element: <LeaveApplication />, verified: true },
  { path: "/settings", element: <SettingsPage />, verified: true },
  { path: "/help-request", element: <HarassmentEmailForm /> },
  { path: "/batch-management", element: <BatchManagement /> },
  { path: "/logout", element: <Logout /> },
];
