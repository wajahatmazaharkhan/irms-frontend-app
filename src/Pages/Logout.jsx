import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { useAppContext } from "@/context/AppContext";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useTitle from "@/Components/useTitle";
const Logout = () => {
  useTitle('Logout')
  const { LogoutUser, setIsLoggedIn } = useAuthContext();
  const { setNotiCounter } = useAppContext();
  const navigate = useNavigate();
  useEffect(() => {
    setIsLoggedIn(false);
    setNotiCounter(0);
    LogoutUser();
    toast.success(`Logged out`);
    navigate("/");
  }, []);
  return <Navigate to="/" />;
};

export default Logout;
