import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import FileViewer from "react-file-viewer";

import "./File.scss";
const File = ({ file }) => {
  const [visible, setVisible] = useState(false);

  const handleError = (e) => {
    console.log("Error", e);
    setVisible(false);
  };

  return (
    <>
      {visible && (
        <div className={`file ${visible ? "active" : ""}`}>
          <FontAwesomeIcon
            className="close"
            icon={faTimes}
            onClick={() => setVisible(false)}
          />
          <FileViewer
            fileType={file.name.split(".")[file.name.split(".").length - 1]}
            filePath={file.url}
            onError={handleError}
            errorComponent={() => (
              <div>
                <h3>
                  No se ha podido previsualizar el archivo. Prueba a descargar
                  el contenido.
                </h3>
              </div>
            )}
          />
        </div>
      )}
      <button
        onDoubleClick={() => {
          setVisible(true);
        }}
        onClick={() => console.log("One click")}
      >
        {file.name}
      </button>
    </>
  );
};

export default File;
