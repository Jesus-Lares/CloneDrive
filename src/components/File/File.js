import React from "react";
import {
  faFile,
  faFileArchive,
  faFileAudio,
  faFileExcel,
  faFileImage,
  faFilePdf,
  faFileVideo,
  faFileWord,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./File.scss";
const getIcon = {
  docx: faFileWord,
  png: faFileImage,
  jpeg: faFileImage,
  gif: faFileImage,
  mp3: faFileAudio,
  mp4: faFileVideo,
  webm: faFileVideo,
  pdf: faFilePdf,
  zip: faFileArchive,
  csv: faFileExcel,
};

const File = ({ file, handleSelection, selection, setFile }) => {
  return (
    <div
      onDoubleClick={() => {
        setFile(file);
      }}
      onClick={() => handleSelection(file)}
      className={`file ${selection?.id === file.id ? "file_active" : ""}`}
    >
      <div className="imageFile">
        <FontAwesomeIcon
          icon={
            getIcon[file.name.split(".")[file.name.split(".").length - 1]]
              ? getIcon[file.name.split(".")[file.name.split(".").length - 1]]
              : faFile
          }
          size="3x"
        />
      </div>
      <span>{file.name.split(".").slice(0, -1).join(".")}</span>
    </div>
  );
};

export default File;
