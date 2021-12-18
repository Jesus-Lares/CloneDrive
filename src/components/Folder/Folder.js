import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { faFolder } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./Folder.scss";

const Folder = ({ folder, mainPath }) => {
  const path = mainPath === "" || mainPath === "folder" ? "" : `/${mainPath}`;
  const navigate = useNavigate();
  const [selection, setSelection] = useState(null);

  return (
    <button
      onClick={() => setSelection(folder)}
      onDoubleClick={() => navigate(`${path}/folder/${folder.id}`)}
      className="folder"
    >
      <div>
        <FontAwesomeIcon icon={faFolder} />
        <span>{folder.name}</span>
      </div>
    </button>
  );
};

export default Folder;
