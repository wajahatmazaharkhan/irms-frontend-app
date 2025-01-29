import React from "react";
import { SideNav, TopNavbar, Footer } from "../Components/compIndex";
import { Dashboard } from "./pageIndex";
import { useAuthContext } from "@/context/AuthContext";
import { IntroPage } from "./pageIndex";

const Home = () => {
  const { loggedIn } = useAuthContext();

  return (
    <>
      {loggedIn ? (
        <>
          <TopNavbar />
          <SideNav />
          <Dashboard />
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
