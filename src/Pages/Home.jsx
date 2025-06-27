import React, { useEffect } from "react";
import { SideNav, TopNavbar, Footer, useTitle } from "../Components/compIndex";
import { Dashboard } from "./pageIndex";
import { useAuthContext } from "@/context/AuthContext";
import { IntroPage } from "./pageIndex";
import { useNavigate } from "react-router-dom";
import NotVerified from "./NotVerified";

const VerifyRoute = ({ children }) => {
  const isVerified = localStorage.getItem("isVerified") === "true";
  return isVerified ? children : <NotVerified />;
}

const Home = () => {
  const navigate = useNavigate();
  const isHr = localStorage.getItem("isHr");
  const isAdmin = localStorage.getItem("isAdmin");

  useEffect(() => {
    if (isAdmin === "true") {
      navigate("/admin-access");
    } else if (isHr === "true" && isAdmin !== "true") {
      navigate("/hrhomepage");
    }
  }, [isHr, isAdmin, navigate]);

  const { loggedIn } = useAuthContext();
  useTitle('Home')
  return (
    <>
      {loggedIn ? (
        (isHr === "true" || isAdmin === "true") ?
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
            <div className="loader"></div>
          </div>
          :
          <>
            <VerifyRoute>
              <TopNavbar />
              <SideNav />
              <Dashboard />
            </VerifyRoute>
          </>
      ) : (
        <>
          <IntroPage />
        </>
      )}
    </>
  );
};

export default Home;
