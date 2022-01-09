import React, { useState } from "react";
import ContentBar from "../../components/ContentBar/ContentBar";
import { useFolder } from "../../hooks/useFolder";

import "./Trash.scss";
import File from "../../components/File/File";
import ViewFiles from "../../components/ViewFiles/ViewFiles";
import FolderSquare from "../../components/FolderSquare/FolderSquare";

const Trash = () => {
  const { childFolders, childFiles, folder } = useFolder(null, "trash");
  const [selection, setSelection] = useState(null);
  const [file, setFile] = useState(null);

  const handleSelection = (select) => {
    if (selection?.id === select.id) {
      setSelection(null);
      return;
    }
    setSelection(select);
  };

  return (
    <div className="trash">
      {folder ? (
        <ContentBar
          selection={selection}
          currentFolder={folder}
          mainPath="trash"
          setSelection={setSelection}
          setFile={setFile}
          trash={true}
          childFolders={childFolders}
          childFiles={childFiles}
        />
      ) : (
        <></>
      )}
      <ul>
        {childFolders.length !== 0 &&
          childFolders.map((child) => (
            <li key={child.id} onClick={() => handleSelection(child)}>
              <FolderSquare
                file={child}
                handleSelection={handleSelection}
                selection={selection}
              />
            </li>
          ))}
        {childFiles.length !== 0 &&
          childFiles.map((child) => (
            <li key={child.id}>
              <File
                file={child}
                handleSelection={handleSelection}
                selection={selection}
                setFile={setFile}
              />
            </li>
          ))}
      </ul>
      {file !== null && <ViewFiles file={file} setFile={setFile} />}
    </div>
  );
};

export default Trash;
