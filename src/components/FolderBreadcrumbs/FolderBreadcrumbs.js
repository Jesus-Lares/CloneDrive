import React from "react";
import { Link } from "react-router-dom";
import { Breadcrumbs } from "@mui/material";

import { LEVEL1_FOLDER, LEVEL2_FOLDER } from "../../hooks/useFolder";
import "./FolderBreadcrumbs.scss";

const FolderBreadcrumbs = ({ currentFolder, id, mainPath }) => {
  let path = [];
  if (mainPath !== null) {
    if (currentFolder.id) {
      if (mainPath === "level1") {
        path = [LEVEL1_FOLDER];
      } else {
        path = [LEVEL2_FOLDER];
      }
    }
  }
  if (currentFolder) path = [...path, ...currentFolder.path];

  const direction = mainPath === null ? "" : `/${mainPath}`;

  return (
    <Breadcrumbs maxItems={2} aria-label="breadcrumb">
      {path?.map((folder, index) => (
        <Link
          to={
            folder?.id
              ? folder.name !== id
                ? `${direction}/folder/${folder.id}`
                : `${mainPath === null ? "/" : ""}${direction}`
              : `${mainPath === null ? "/" : ""}${direction}`
          }
          key={index}
        >
          {folder.name === id
            ? mainPath !== null
              ? mainPath
              : "Root"
            : folder.name}
        </Link>
      ))}
      <p>
        {currentFolder.name === id
          ? mainPath !== null
            ? mainPath
            : "Root"
          : currentFolder.name}
      </p>
    </Breadcrumbs>
  );
};

export default FolderBreadcrumbs;
