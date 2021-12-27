import React from "react";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FileViewer from "react-file-viewer";

import "./ViewFiles.scss";

const ViewFiles = ({ file, setFile }) => {
  const getType = () => {
    const typeFile = file.name.split(".")[file.name.split(".").length - 1];
    switch (typeFile) {
      case "docx":
      case "png":
      case "jpeg":
      case "gif":
      case "csv":
      case "xslx":
      case "mp4":
      case "webm":
      case "mp3":
        return (
          <FileViewer
            fileType={typeFile}
            filePath={file.url}
            onError={(e) => console.log(e)}
          />
        );
      case "pdf":
        return (
          <div>
            <h1>pdf</h1>
          </div>
        );

      default:
        return <div>Formato no valido</div>;
    }
  };

  return (
    file && (
      <div className="viewFile">
        <FontAwesomeIcon
          className="close"
          icon={faTimes}
          onClick={() => setFile(null)}
        />
        {getType()}
      </div>
    )
  );
};

export default ViewFiles;
