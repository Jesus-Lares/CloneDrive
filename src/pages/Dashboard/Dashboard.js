import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import "./Dashboard.scss";
const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="dashboard">
      <button className="btn signout" onClick={() => logout(navigate)}>
        Sign out
      </button>
    </div>
  );
};

export default Dashboard;
