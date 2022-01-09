import React from "react";
import { faDownload, faTimes } from "@fortawesome/free-solid-svg-icons";
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
            <iframe
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
              name={file.name}
              src={file.url}
              frameBorder="0"
            />
          </div>
        );

      default:
        return (
          <div className="noView">
            <div>
              <h3>
                No hay ninguna vista previa disponible para archivos con la
                extension .{typeFile}
              </h3>
              <a href={file.url} download target="_blank" rel="noreferrer">
                <button className="btn">
                  <FontAwesomeIcon icon={faDownload} />
                  Descargar
                </button>
              </a>
            </div>
          </div>
        );
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
