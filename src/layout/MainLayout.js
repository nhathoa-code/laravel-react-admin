import React, { useEffect } from "react";
import Header from "../layout/Header";
import Aside from "../layout/Aside";
import { Outlet } from "react-router-dom";
const MainLayout = () => {
  useEffect(() => {
    const script = document.createElement("script");

    script.src = "/js/main.js";
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);
  return (
    <div id="page-container">
      <Header />
      <div id="inner-container">
        <Aside />
        <div id="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
