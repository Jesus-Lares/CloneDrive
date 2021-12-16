import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.scss";

const Navbar = () => {
  const { currentUser } = useAuth();
  let name = "Jesús Lares";
  let admin = false;
  let photo = false;
  return (
    <header>
      <nav>
        <div className="logo">
          <span>CD</span>
          <span>CloneDrive</span>
        </div>
        <ul>
          {admin && (
            <li>
              <Link to="/admin">
                <span>Admin</span>
              </Link>
            </li>
          )}
          <li key="name">
            <Link to="/" className="user">
              <span>{name}</span>
              {photo ? <img /> : <div>{name[0]}</div>}
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
