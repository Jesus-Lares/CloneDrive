import React from "react";

import "./File.scss";
const File = ({ file, handleSelection, selection, setFile }) => {
  console.log(selection?.id === file.id);
  return (
    <div
      onDoubleClick={() => {
        setFile(file);
      }}
      onClick={() => handleSelection(file)}
      className={`file ${selection?.id === file.id ? "file_active" : ""}`}
    >
      <div className="imageFile">hi</div>
      <span>{file.name.split(".").slice(0, -1).join(".")}</span>
    </div>
  );
};

export default File;
