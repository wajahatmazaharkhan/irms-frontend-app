/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Navigate } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";
import NotAuthorized from "@/Pages/NotAuthorized";
import NotVerified from "@/Pages/NotVerified";

const ProtectedRoute = ({
  children,
  requireAuth = false,
  requireAdmin = false,
  requireHr = false,
  requireVerified = false,
}) => {
  const { loggedIn } = useAuthContext();

  const role = localStorage.getItem("role");
  const isAdmin =
    localStorage.getItem("isAdmin") === "true" || role === "hrHead";
  const isHr = localStorage.getItem("isHr") === "true";
  const isVerified = localStorage.getItem("isVerified") === "true";

  if (requireAuth && !loggedIn) return <Navigate to="/home-page" />;
  if (requireAdmin && !isAdmin) return <NotAuthorized />;
  if (requireHr && !isHr) return <NotAuthorized />;
  if (requireVerified && !isVerified) return <NotVerified />;

  return children;
};

export default ProtectedRoute;
