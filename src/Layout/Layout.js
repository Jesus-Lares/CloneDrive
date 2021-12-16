import React from "react";
import { useLocation } from "react-router-dom";

import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";
import ContentBar from "../components/ContentBar/ContentBar";
import "./Layout.scss";

const Layout = ({ children }) => {
  const { pathname } = useLocation();

  return pathname === "/login" ? (
    <>{children}</>
  ) : (
    <>
      <Navbar />
      <main>
        <Sidebar />
        <div>
          <ContentBar />
          {children}
        </div>
      </main>
    </>
  );
};

export default Layout;
