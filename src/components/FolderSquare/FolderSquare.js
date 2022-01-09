import React from "react";
import { faFolder } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { basicAlert } from "../Alert";

const FolderSquare = ({ file, handleSelection, selection }) => {
  return (
    <div
      onDoubleClick={() =>
        basicAlert(
          "Para abrir la carpeta es necesario sacarla de la papelera",
          "info"
        )
      }
      onClick={() => handleSelection(file)}
      className={`file ${selection?.id === file.id ? "file_active" : ""}`}
    >
      <div className="imageFile">
        <FontAwesomeIcon icon={faFolder} size="3x" />
      </div>
      <span>{file.name}</span>
    </div>
  );
};

export default FolderSquare;
