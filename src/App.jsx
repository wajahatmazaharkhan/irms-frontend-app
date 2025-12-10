import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HrProvider } from "./context/HrContext.jsx";
import AskHR from "./Pages/AskHR";

import {
  Aboutus,
  FAQ,
  Help,
  Home,
  Notifications,
  Profile,
  Projects,
  Reports,
  Signin,
  SignUp,
  Logout,
  Stores,
  AdminHomePage,
  AdminProject,
  AdminReport,
  AllUsers,
  LeaveApplication,
  NotVerified,
  AdminHelpPage,
  NotAuthorized,
  UserAttendance,
  SettingsPage,
  ResetPassword,
  InternAttendance,
  AdminHelp,
  InternTasksSubmissions,
  Internleaveapplication,
  IntroPage,
  AdminNotify,
  OTPVerification,
  NewPasswordForm,
  HarassmentEmailForm,
  BatchDashboard,
  InternRankings,
  InternRaiseTicket,
  MyTickets,
} from "./Pages/pageIndex";
import {
  AdminTask,
  CoreDashboard,
  Footer,
  InternTasksPage,
  Navbar,
  Privacypolicy,
} from "./Components/compIndex";
import "./App.css";
import { NotFound } from "./Components/Notfound";
import { useAuthContext } from "./context/AuthContext";
import AllAttendance from "./Admin/AllAttendance";

import HrHomepage from "./HrHeadAndIntern/HrHomePage";

import {
  HrTaskAssignment,
  HrTasksubmissions,
  Hrprofile,
  HrHelpPage,
  InternsHrLeaveApplication,
  InternManagement,
  HrBatchManagement,
  AllHrUsers,
  HrAllAttendance,
  HrProject,
  HrNotify,
  HrReport,
  InternAttendancePage,
} from "./HrHeadAndIntern/HrIndex";
import AdminHRManagement from "./Admin/AdminHRManagement.jsx";
import UserManagement from "./Admin/UserManagement.jsx";
import BatchManagement from "./Admin/BatchManagement.jsx";
import ChatInterface from "./HrHeadAndIntern/InternChat.jsx";
import HRChatDashboard from "./HrHeadAndIntern/HrChatBox.jsx";
import "react-calendar/dist/Calendar.css";

import {
  CommHomePage,
  ManageTickets,
  CommRanking,
} from "./CommunicationTeam/commIndex";
import { useEffect } from "react";

const AdminRoute = ({ children }) => {
  const role = localStorage.getItem("role");
  const isAdmin =
    localStorage.getItem("isAdmin") === "true" || role === "hrHead";
  return isAdmin ? children : <NotAuthorized />;
};

const PrivateRoute = ({ children }) => {
  const { loggedIn } = useAuthContext();
  return loggedIn ? children : <IntroPage />;
};

const HrRoute = ({ children }) => {
  const isHr = localStorage.getItem("isHr") === "true";
  return isHr ? <VerifyRoute>{children}</VerifyRoute> : <NotAuthorized />;
};

const VerifyRoute = ({ children }) => {
  const isVerified = localStorage.getItem("isVerified") === "true";
  return isVerified ? children : <NotVerified />;
};

const App = () => {
  
  useEffect(() => {
    // Check for stored preference on page load
    if (
      localStorage.getItem("theme") === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <HrProvider>
      <Routes>
        <Route path="/login" element={<Signin />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify-reset-token" element={<NewPasswordForm />} />
        <Route path="/reset-account-password" element={<ResetPassword />} />
        <Route path="/verify-otp" element={<OTPVerification />} />
        <Route path="/aboutus" element={<Aboutus />} />
        <Route path="/privacypolicy" element={<Privacypolicy />} />
        <Route path="/frequently-asked-questions" element={<FAQ />} />
        <Route path="*" element={<NotFound />} />

        <Route
          path="/admin-access"
          element={
            <AdminRoute>
              <AdminHomePage />
            </AdminRoute>
          }
        />

        <Route
          path="/Projectmanagement"
          element={
            <AdminRoute>
              <AdminProject />
            </AdminRoute>
          }
        />
        <Route
          path="/Admintask"
          element={
            <AdminRoute>
              <AdminTask />
            </AdminRoute>
          }
        />
        <Route
          path="/Weeklyreport"
          element={
            <AdminRoute>
              <AdminReport />
            </AdminRoute>
          }
        />
        <Route
          path="/Taskassignment"
          element={
            <AdminRoute>
              <AdminTask />
            </AdminRoute>
          }
        />
        <Route
          path="/allusers"
          element={
            <AdminRoute>
              <AllUsers />
            </AdminRoute>
          }
        />
        <Route
          path="/adminhelppage"
          element={
            <AdminRoute>
              <AdminHelpPage />
            </AdminRoute>
          }
        />
        <Route
          path="/intern-attendance"
          element={
            <AdminRoute>
              <InternAttendance />
            </AdminRoute>
          }
        />
        <Route
          path="/batch-dashboard"
          element={
            <PrivateRoute>
              <VerifyRoute>
                <BatchDashboard />
              </VerifyRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/interntasksubmissions"
          element={
            <AdminRoute>
              <InternTasksSubmissions />
            </AdminRoute>
          }
        />
        <Route
          path="view-attendance-all"
          element={
            <AdminRoute>
              <AllAttendance />
            </AdminRoute>
          }
        />

        {/* Protected User Routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <VerifyRoute>
                {/* <CoreDashboard /> */}
                <BatchDashboard />
              </VerifyRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/view-all-tasks"
          element={
            <PrivateRoute>
              <VerifyRoute>
                {/* <CoreDashboard /> */}
                <InternTasksPage />
              </VerifyRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              {/* <VerifyRoute> */}
              <BatchDashboard />
              {/* </VerifyRoute> */}
            </PrivateRoute>
          }
        />
        <Route
          path="/your-profile"
          element={
            <PrivateRoute>
              <VerifyRoute>
                <Profile />
              </VerifyRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <PrivateRoute>
              <VerifyRoute>
                <Notifications />
              </VerifyRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <PrivateRoute>
              <VerifyRoute>
                <Reports />
              </VerifyRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <PrivateRoute>
              <VerifyRoute>
                <Projects />
              </VerifyRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/help"
          element={
            <PrivateRoute>
              {/* <VerifyRoute> */}
              <Help />
              {/* </VerifyRoute> */}
            </PrivateRoute>
          }
        />
        <Route
          path="/intern-rankings"
          element={
            <PrivateRoute>
              <VerifyRoute>
                <InternRankings />
              </VerifyRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/internticket"
          element={
            <PrivateRoute>
              <InternRaiseTicket />
            </PrivateRoute>
          }
        />
        <Route
          path="/viewmytickets"
          element={
            <PrivateRoute>
              <MyTickets />
            </PrivateRoute>
          }
        />
        <Route
          path="/internchat/:receiverId"
          element={
            <PrivateRoute>
              <ChatInterface />
            </PrivateRoute>
          }
        />
        {/* <Route
          path="/AskHR"
          element={
            <PrivateRoute>
              <AskHR />
            </PrivateRoute>
          }
        /> */}
        <Route
          path="/my-attendance"
          element={
            <PrivateRoute>
              <VerifyRoute>
                <UserAttendance />
              </VerifyRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/stores"
          element={
            <PrivateRoute>
              <VerifyRoute>
                <Stores />
              </VerifyRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/leave-application"
          element={
            <PrivateRoute>
              <VerifyRoute>
                <LeaveApplication />
              </VerifyRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <VerifyRoute>
                <SettingsPage />
              </VerifyRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/Internleaveapplication" //add restriction to this route only hr or admin can access
          element={
            <HrRoute>
              <Internleaveapplication mode="hr" />
            </HrRoute>
          }
        />
        <Route
          path="/Internleaveapplications" //add restriction to this route only hr or admin can access
          element={
            <AdminRoute>
              <Internleaveapplication mode="admin" />
            </AdminRoute>
          }
        />
        <Route
          path="/logout"
          element={
            <PrivateRoute>
              <Logout />
            </PrivateRoute>
          }
        />

        <Route
          path="/notify-all" //add restriction to this route only admin can access
          element={
            <AdminRoute>
              <AdminNotify />
            </AdminRoute>
          }
        />
        <Route
          path="/admin-hr-management" //add restriction to this route only admin can access
          element={
            <AdminRoute>
              <AdminHRManagement />
            </AdminRoute>
          }
        />
        <Route
          path="/user-management" //add restriction to this route only admin can access
          element={
            <AdminRoute>
              <UserManagement />
            </AdminRoute>
          }
        />
        <Route
          path="/help-request"
          element={
            <PrivateRoute>
              <HarassmentEmailForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/home-page"
          element={
            <PrivateRoute>
              <IntroPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/batch-management"
          element={
            <PrivateRoute>
              {/* <VerifyRoute> */}
              <BatchManagement />
              {/* </VerifyRoute> */}
            </PrivateRoute>
          }
        />

        {/* hrhead and hr interns routes  */}
        <Route
          path="/hrhomepage"
          element={
            <HrRoute>
              <HrHomepage />
            </HrRoute>
          }
        />
        <Route
          path="/hrinternsmgmt"
          element={
            <HrRoute>
              <InternManagement />
            </HrRoute>
          }
        />
        <Route
          path="/hrbatchmgmt"
          element={
            <HrRoute>
              <HrBatchManagement />
            </HrRoute>
          }
        />
        <Route
          path="/allhrusers"
          element={
            <HrRoute>
              <AllHrUsers />
            </HrRoute>
          }
        />
        <Route
          path="/hrchat"
          element={
            <HrRoute>
              <HRChatDashboard />
            </HrRoute>
          }
        />
        <Route
          path="/hrchat/:receiverId"
          element={
            <HrRoute>
              <HRChatDashboard />
            </HrRoute>
          }
        />
        <Route
          path="/hrallattendance"
          element={
            <HrRoute>
              <HrAllAttendance />
            </HrRoute>
          }
        />
        <Route
          path="/internshrleaveapplications"
          element={
            <HrRoute>
              <InternsHrLeaveApplication />
            </HrRoute>
          }
        />
        <Route
          path="/hrhelp"
          element={
            <HrRoute>
              <HrHelpPage />
            </HrRoute>
          }
        />
        <Route
          path="/hrtasksubmissions"
          element={
            <HrRoute>
              <HrTasksubmissions />
            </HrRoute>
          }
        />
        <Route
          path="/hrprojects"
          element={
            <HrRoute>
              <HrProject />
            </HrRoute>
          }
        />
        <Route
          path="/hrnotify"
          element={
            <HrRoute>
              <HrNotify />
            </HrRoute>
          }
        />
        <Route
          path="/hrreports"
          element={
            <HrRoute>
              <HrReport />
            </HrRoute>
          }
        />
        <Route
          path="/hrtaskassignment"
          element={
            <HrRoute>
              <HrTaskAssignment />
            </HrRoute>
          }
        />
        <Route
          path="/hrattendance/:id"
          element={
            <HrRoute>
              <InternAttendancePage />
            </HrRoute>
          }
        />

        {/* Comm team routes  */}
        <Route path="/commhomepage" element={<CommHomePage />} />
        <Route path="/commtickets" element={<ManageTickets />} />
        <Route path="/commrank" element={<CommRanking />} />
      </Routes>
    </HrProvider>
  );
};

export default App;
