import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext();

const StoreContextProvider = ({ children }) => {
  const [token, setToken] = useState("");
  const backendUrl = "http://localhost:5000";
  useEffect(() => {
    if (!token && localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  const value = {
    token,
    setToken,
    backendUrl,
  }

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
