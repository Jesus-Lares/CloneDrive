import { Avatar } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ModalEdit from "../ModalEdit/ModalEdit";
import "./Navbar.scss";

const Navbar = () => {
  const navigate = useNavigate();
  const { currentUser, logout, photo, setPhoto } = useAuth();
  const [visible, setVisible] = useState(false);
  const [visibleEdit, setVisibleEdit] = useState(false);

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
              <Link to="/users">
                <span>Usuarios</span>
              </Link>
            </li>
          )}
          <li id="cardUser" key="name">
            <button
              onClick={() => setVisible((visible) => !visible)}
              className="user"
            >
              <span>{currentUser.name}</span>
              <Avatar src={photo}>{currentUser.name[0]}</Avatar>
            </button>
            <div className={`cardUser ${visible ? "active" : ""}`}>
              <div className="info">
                <Avatar src={photo}>{currentUser.name[0]}</Avatar>

                <div className="text">
                  <p>{currentUser.name}</p>
                  <p>{currentUser.email}</p>
                </div>
              </div>
              <hr />
              <ul>
                <li>
                  <button onClick={() => setVisibleEdit(true)}>
                    Editar perfil
                  </button>
                </li>
                <li>
                  <button>Cambiar Contraseña</button>
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
        {visibleEdit && (
          <ModalEdit
            visible={visibleEdit}
            selection={currentUser}
            onClose={() => setVisibleEdit(false)}
            setPhoto={(newPhoto) => setPhoto(newPhoto)}
          />
        )}
      </nav>
    </header>
  );
};

export default Navbar;
