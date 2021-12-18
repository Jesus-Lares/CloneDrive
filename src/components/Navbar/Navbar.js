import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.scss";

const Navbar = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    window.addEventListener("click", (e) => {
      if (document.getElementById("cardUser")) {
        if (!document.getElementById("cardUser").contains(e.target)) {
          setVisible(false);
        }
      }
    });
    return window.removeEventListener("click", () => {});
  }, []);
  return (
    <header>
      <nav>
        <Link to="/" className="logo">
          <span>CD</span>
          <span>CloneDrive</span>
        </Link>
        <ul>
          {currentUser?.type === 3 && (
            <li>
              <Link to="/admin">
                <span>Admin</span>
              </Link>
            </li>
          )}
          <li id="cardUser" key="name">
            <button
              onClick={() => setVisible((visible) => !visible)}
              className="user"
            >
              <span>{currentUser.name}</span>
              {currentUser?.photoURL ? (
                <img src="" alt="user" />
              ) : (
                <div className="letter">{currentUser.name[0]}</div>
              )}
            </button>
            <div className={`cardUser ${visible ? "active" : ""}`}>
              <div className="info">
                {currentUser?.photoURL ? (
                  <img src="" alt="user" />
                ) : (
                  <div className="letter">{currentUser.name[0]}</div>
                )}
                <div className="text">
                  <p>{currentUser.name}</p>
                  <p>{currentUser.email}</p>
                </div>
              </div>
              <hr />
              <ul>
                <li>
                  <button>Editar perfil</button>
                </li>
                <li>
                  <button onClick={() => logout(navigate)}>
                    Cerrar sesion
                  </button>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
