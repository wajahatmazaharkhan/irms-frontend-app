import {
  HrHomePage,
  InternManagement,
  HrBatchManagement,
  AllHrUsers,
  HrAllAttendance,
  InternsHrLeaveApplication,
  HrHelpPage,
  HrTasksubmissions,
  HrProject,
  HrNotify,
  HrReport,
  HrTaskAssignment,
  InternAttendancePage,
  InternLeaveApplications,
} from "@/HrHeadAndIntern";

import { Internleaveapplication } from "../Pages/pageIndex";
import HRChatDashboard from "../HrHeadAndIntern/HrChatBox";

export const hrRoutes = [
  { path: "/hrhomepage", element: <HrHomePage /> },
  { path: "/hrinternsmgmt", element: <InternManagement /> },
  { path: "/hrbatchmgmt", element: <HrBatchManagement /> },
  { path: "/allhrusers", element: <AllHrUsers /> },
  { path: "/hrchat", element: <HRChatDashboard /> },
  { path: "/hrchat/:receiverId", element: <HRChatDashboard /> },
  { path: "/hrallattendance", element: <HrAllAttendance /> },
  {
    path: "/internshrleaveapplications",
    element: <InternsHrLeaveApplication />,
  },
  { path: "/hrhelp", element: <HrHelpPage /> },
  { path: "/hrtasksubmissions", element: <HrTasksubmissions /> },
  { path: "/hrprojects", element: <HrProject /> },
  { path: "/hrnotify", element: <HrNotify /> },
  { path: "/hrreports", element: <HrReport /> },
  { path: "/hrtaskassignment", element: <HrTaskAssignment /> },
  { path: "/hrattendance/:id", element: <InternAttendancePage /> },
  {
    path: "/Internleaveapplication",
    element: <InternLeaveApplications mode="hr" />,
  },
  {
    path: "/Internleaveapplications",
    element: <Internleaveapplication mode="hr" />,
  },
];
