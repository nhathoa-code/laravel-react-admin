import React, { createContext, useState } from "react";

export const AppStoreContext = createContext({});

export const AppStoreProvider = ({ children }) => {
  return (
    <AppStoreContext.Provider value={{}}>{children}</AppStoreContext.Provider>
  );
};
