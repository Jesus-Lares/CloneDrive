import React from "react";
import { useNavigate } from "react-router-dom";
import { faFolder } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./Folder.scss";

const Folder = ({ folder, mainPath, handleSelection, selection }) => {
  const path = mainPath === "" || mainPath === "folder" ? "" : `/${mainPath}`;
  const navigate = useNavigate();

  return (
    <button
      onDoubleClick={() => navigate(`${path}/folder/${folder.id}`)}
      onClick={() => handleSelection(folder)}
      className={`folder ${selection?.id === folder.id ? "folder_active" : ""}`}
    >
      <FontAwesomeIcon icon={faFolder} />
      <div>{folder.name}</div>
    </button>
  );
};

export default Folder;
