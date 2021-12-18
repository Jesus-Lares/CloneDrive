import {
  faCheckCircle,
  faTimes,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CircularProgress } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom";

import "./ProgressModal.scss";
const ProgressModal = ({ files = [], closeModal = () => {} }) => {
  return ReactDOM.createPortal(
    <div className="progressModal">
      <div className="headerModal">
        <h5>Archivos</h5>
        <FontAwesomeIcon onClick={closeModal} icon={faTimes} />
      </div>
      <div className="bodyModal">
        <ul>
          {files.length > 0 &&
            files.map((uploadFile) => (
              <li key={uploadFile.id}>
                {uploadFile?.error ? (
                  <FontAwesomeIcon icon={faTimesCircle} color="#c80000bf" />
                ) : uploadFile.progress === 100 ? (
                  <FontAwesomeIcon icon={faCheckCircle} color="#84b84c" />
                ) : (
                  <CircularProgress
                    variant={
                      uploadFile.progress === 0
                        ? "indeterminate"
                        : "determinate"
                    }
                    value={uploadFile.progress}
                  />
                )}
                <div>{uploadFile.name}</div>
              </li>
            ))}
        </ul>
      </div>
    </div>,
    document.body
  );
};

export default ProgressModal;
