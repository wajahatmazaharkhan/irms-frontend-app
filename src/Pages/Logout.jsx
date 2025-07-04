import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { useAppContext } from "@/context/AppContext";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useTitle from "@/Components/useTitle";
import axios from "axios";

const Logout = () => {
  useTitle('Logout')
  const { LogoutUser, setIsLoggedIn } = useAuthContext();
  const { setNotiCounter } = useAppContext();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const sessionStart = localStorage.getItem("sessionStart");
    axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/auth/logout`,
      { sessionStart },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then(() => {
        setIsLoggedIn(false);
        setNotiCounter(0);
        LogoutUser();
        toast.success(`Logged out`);
        localStorage.removeItem("sessionStart");
        localStorage.removeItem("role");
        navigate("/");
      })
      .catch((error) => {
        console.error("Logout error:", error);
        toast.error(`Logout failed`);
      });
  }, []);
  return <Navigate to="/" />;
};

export default Logout;

