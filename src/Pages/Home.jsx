import React from "react";
import { SideNav, TopNavbar, Footer, useTitle } from "../Components/compIndex";
import { Dashboard } from "./pageIndex";
import { useAuthContext } from "@/context/AuthContext";
import { IntroPage } from "./pageIndex";

const Home = () => {
  const { loggedIn } = useAuthContext();
  useTitle('Home')
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
