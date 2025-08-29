import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  //track whether the officer is logged in.
  const [loggedIn, setLoggedIn] = useState(false);
  const [ready, setReady] = useState(false);

  //read localStorage on page load to keep the login state after a refresh.
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("officerLoggedIn");
      setLoggedIn(saved === "true");
      setReady(true);
    }
  }, []);

  const loginUser = () => {
    localStorage.setItem("officerLoggedIn", "true");
    setLoggedIn(true);
  };

  const logoutUser = () => {
    localStorage.removeItem("officerLoggedIn");
    setLoggedIn(false);
  };

  //Any component can access loggedIn and login/logout functions.
  return (
    <AuthContext.Provider value={{ loggedIn, loginUser, logoutUser, ready }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
