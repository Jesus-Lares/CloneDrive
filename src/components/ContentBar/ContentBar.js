import React from "react";
import { Link } from "react-router-dom";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faUpload } from "@fortawesome/free-solid-svg-icons";

import "./ContentBar.scss";
const ContentBar = () => {
  return (
    <div className="contentBar">
      <Breadcrumbs maxItems={4} aria-label="breadcrumb">
        <Link to="/">Mis archivos</Link>
        <Link to="#">Catalog</Link>
        <Link to="#">Accessories</Link>
        <Link to="#">New Collection</Link>
        <p color="text.primary">Belts</p>
      </Breadcrumbs>
      <div className="uploadContent">
        <button>
          <FontAwesomeIcon icon={faPlusCircle} />
          Nueva Carpeta
        </button>
        <button>
          <FontAwesomeIcon icon={faUpload} />
          Subir archivo
        </button>
      </div>
    </div>
  );
};

export default ContentBar;
