/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loggedIn, setIsLoggedIn] = useState(!!token);
  
  const [admin, setAdmin] = useState(localStorage.getItem("isAdmin") === "true");
  const [isAdmin, setIsAdmin] = useState(!!admin);
  
  const [hr, setHr] = useState(localStorage.getItem("isHr") === "true");
  const [isHr, setIsHr] = useState(!!hr);


  const storeIsAdminState = (adminState) => {
    localStorage.setItem("isAdmin", adminState);
    setIsAdmin(adminState);
  };
  
  const storeIsHrState = (hrState) => {
    localStorage.setItem("isHr", hrState);
    setIsHr(hrState);
  };

  const storeTokenInLocalStorage = (serverToken) => {
    localStorage.setItem("token", serverToken);
    setToken(serverToken);
    setIsLoggedIn(!!serverToken);
  };

  // Logout function
  const LogoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
	localStorage.removeItem("isHr");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    setIsLoggedIn(false);
  };

  // Store UserId
  const storeUserId = (userId) => {
    localStorage.setItem("userId", userId);
  };

  return (
    <AuthContext.Provider
      value={{
        loggedIn,
        setIsLoggedIn,
        storeTokenInLocalStorage,
        storeIsAdminState,
		storeIsHrState,
        LogoutUser,
        storeUserId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
