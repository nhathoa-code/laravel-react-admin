import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppStoreContext } from "./AppStoreProvider";
export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [isLogginChecked, setIsLogginChecked] = useState(false);
  const [admin, setAdmin] = useState(null);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/admin`)
      .then((res) => {
        setAdmin({ ...res.data.admin });
        setIsLogginChecked(true);
      })
      .catch(() => {
        setIsLogginChecked(true);
      });
  }, []);
  return (
    <AuthContext.Provider
      value={{ isLogginChecked, setIsLogginChecked, admin, setAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
};
