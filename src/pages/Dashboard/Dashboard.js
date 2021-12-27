import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import ContentBar from "../../components/ContentBar/ContentBar";
import File from "../../components/File/File";
import Folder from "../../components/Folder/Folder";
import ViewFiles from "../../components/ViewFiles/ViewFiles";
import { useFolder } from "../../hooks/useFolder";

import "./Dashboard.scss";
const Dashboard = () => {
  const { folderId } = useParams();
  const { pathname } = useLocation();
  const mainPath = pathname.split("/")[1];
  const path = mainPath === "" || mainPath === "folder" ? null : mainPath;
  const { childFolders, childFiles, folder } = useFolder(folderId, mainPath);
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
    <div>
      {folder ? (
        <ContentBar
          selection={selection}
          currentFolder={folder}
          mainPath={path}
          setSelection={setSelection}
          setFile={setFile}
        />
      ) : (
        <></>
      )}
      <div className="dashboard">
        <div className="containFolders">
          {childFolders.length > 0 ? (
            <>
              {childFolders.map((folder) => (
                <div key={folder.id}>
                  <Folder
                    selection={selection}
                    handleSelection={handleSelection}
                    mainPath={mainPath}
                    folder={folder}
                  />
                </div>
              ))}
            </>
          ) : (
            <></>
          )}
        </div>
        {childFiles.length > 0 && childFolders.length > 0 && <hr />}
        <div className="containFiles">
          {childFiles.length > 0 ? (
            childFiles.map((file) => (
              <div key={file.id}>
                <File
                  setFile={setFile}
                  file={file}
                  selection={selection}
                  handleSelection={handleSelection}
                />
              </div>
            ))
          ) : (
            <></>
          )}
        </div>
      </div>
      {file !== null && <ViewFiles file={file} setFile={setFile} />}
    </div>
  );
};

export default Dashboard;
