import React from "react";
import { Routes, Route } from "react-router-dom";
import { useAuthContext } from "./context/AuthContext";
import { NotFound } from "./Components/Notfound";
import Navbar from "./Pages/Navbar";
import Hero from "./Components/Hero";
import Features from "./Components/Features";
import TechStack from "./Components/TechStack";
import Stats from "./Components/Stats";
import Testimonials from "./Components/Testimonials";
import FloatingIcons from "./Components/FloatingIcons";
import ScrollingLogos from "./Components/ScrollingLogos";
import SuccessStories from "./Components/SuccessStories";
import CompanyMetrics from "./Components/CompanyMetrics";
import GradientBackground from "./Components/GradientBackground";

// Pages
import {
  Aboutus,
  FAQ,
  Help,
  Home,
  Notifications,
  PrivacyPolicy,
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
  AdminHelpPage,
  NotAuthorized,
  UserAttendance,
  SettingsPage,
  ResetPassword,
  InternAttendance,
  AdminHelp,
  InternTasksSubmissions,
  Internleaveapplication,
  AdminNotify,
} from "./Pages/pageIndex";

// Components
import { AdminTask, CoreDashboard, Footer, Navbar as AppNavbar } from "./Components/compIndex";

// Admin Components
import AllAttendance from "./Admin/AllAttendance";

// Route Protection Components
const AdminRoute = ({ children }) => {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  return isAdmin ? children : <NotAuthorized />;
};

const PrivateRoute = ({ children }) => {
  const { loggedIn } = useAuthContext();
  return loggedIn ? children : <Signin />;
};

const App = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background and Floating Elements */}
      <GradientBackground />
      <FloatingIcons />

      <Routes>
        {/* Public Landing Page */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Hero />
              <ScrollingLogos />
              <TechStack />
              <Features />
              <CompanyMetrics />
              <SuccessStories />
              <Stats />
              <Testimonials />
            </>
          }
        />

        {/* Public Routes */}
        <Route path="/login" element={<Signin />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/reset-account-password" element={<ResetPassword />} />
        <Route path="/aboutus" element={<Aboutus />} />
        <Route path="/privacypolicy" element={<PrivacyPolicy />} />
        <Route path="/frequently-asked-questions" element={<FAQ />} />
        <Route path="/help" element={<Help />} />
        <Route path="*" element={<NotFound />} />

        {/* Admin Routes */}
        <Route
          path="/Adminhomepage"
          element={
            <AdminRoute>
              <AdminHomePage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin-projects"
          element={
            <AdminRoute>
              <AdminProject />
            </AdminRoute>
          }
        />
        <Route
          path="/admin-reports"
          element={
            <AdminRoute>
              <AdminReport />
            </AdminRoute>
          }
        />
        <Route
          path="/admin-help"
          element={
            <AdminRoute>
              <AdminHelpPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin-notify"
          element={
            <AdminRoute>
              <AdminNotify />
            </AdminRoute>
          }
        />
        <Route
          path="/all-users"
          element={
            <AdminRoute>
              <AllUsers />
            </AdminRoute>
          }
        />
        <Route
          path="/leave-application"
          element={
            <AdminRoute>
              <LeaveApplication />
            </AdminRoute>
          }
        />
        <Route
          path="/all-attendance"
          element={
            <AdminRoute>
              <AllAttendance />
            </AdminRoute>
          }
        />

        {/* Protected User Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <PrivateRoute>
              <Projects />
            </PrivateRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <PrivateRoute>
              <Notifications />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/user-attendance"
          element={
            <PrivateRoute>
              <UserAttendance />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <SettingsPage />
            </PrivateRoute>
          }
        />

        {/* Intern Routes */}
        <Route
          path="/intern-attendance"
          element={
            <PrivateRoute>
              <InternAttendance />
            </PrivateRoute>
          }
        />
        <Route
          path="/intern-tasks"
          element={
            <PrivateRoute>
              <InternTasksSubmissions />
            </PrivateRoute>
          }
        />
        <Route
          path="/intern-leave-application"
          element={
            <PrivateRoute>
              <Internleaveapplication />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
