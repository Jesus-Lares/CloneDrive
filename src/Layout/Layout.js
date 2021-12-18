import React from "react";
import { useLocation } from "react-router-dom";

import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";
import { useAuth } from "../context/AuthContext";

const Layout = ({ children }) => {
  const { pathname } = useLocation();
  const { currentUser } = useAuth();
  return pathname === "/login" || currentUser === null ? (
    <>{children}</>
  ) : (
    <>
      <Navbar />
      <main>
        <Sidebar />
        <div className="content">{children}</div>
      </main>
    </>
  );
};

export default Layout;
