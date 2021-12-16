import React from "react";
import { Link, useMatch, useResolvedPath } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder, faTrash, faUser } from "@fortawesome/free-solid-svg-icons";

import "./Sidebar.scss";

const Sidebar = () => {
  let type = 3;

  return (
    <div className="sidebar">
      <h2>Gestor de archivos</h2>
      <ul>
        <li>
          <CustomLink to="/">
            <>
              <FontAwesomeIcon icon={faFolder} />
              Mis archivos
            </>
          </CustomLink>
        </li>
        {type > 2 && (
          <li>
            <CustomLink to="/level2">
              <>
                <FontAwesomeIcon icon={faUser} />
                Nivel 2
              </>
            </CustomLink>
          </li>
        )}
        {type > 1 && (
          <li>
            <CustomLink to="/level1">
              <>
                <FontAwesomeIcon icon={faUser} />
                Nivel 1
              </>
            </CustomLink>
          </li>
        )}
        <li>
          <CustomLink to="/trash">
            <>
              <FontAwesomeIcon icon={faTrash} />
              Papelera
            </>
          </CustomLink>
        </li>
      </ul>
    </div>
  );
};

function CustomLink({ children, to }) {
  let resolved = useResolvedPath(to);
  let match = useMatch({ path: resolved.pathname, end: true });

  return (
    <div>
      <Link className={match ? "active" : ""} to={to}>
        {children}
      </Link>
    </div>
  );
}
export default Sidebar;
