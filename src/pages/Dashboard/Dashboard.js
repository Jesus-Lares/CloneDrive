import React from "react";
import { useLocation, useParams } from "react-router-dom";
import ContentBar from "../../components/ContentBar/ContentBar";
import File from "../../components/File/File";
import Folder from "../../components/Folder/Folder";
import { useFolder } from "../../hooks/useFolder";

import "./Dashboard.scss";
const Dashboard = () => {
  const { folderId } = useParams();
  const { pathname } = useLocation();
  const mainPath = pathname.split("/")[1];
  const path = mainPath === "" || mainPath === "folder" ? null : mainPath;

  const { childFolders, childFiles, folder } = useFolder(folderId, mainPath);
  console.log(folder);
  return (
    <div>
      {folder ? <ContentBar currentFolder={folder} mainPath={path} /> : <></>}
      <div className="dashboard">
        <div className="containFolders">
          {childFolders.length > 0 ? (
            childFolders.map((folder) => (
              <div key={folder.id}>
                <Folder mainPath={mainPath} folder={folder} />
              </div>
            ))
          ) : (
            <></>
          )}
        </div>
        {childFiles.length > 0 && childFolders.length > 0 && <hr />}
        {childFiles.length > 0 ? (
          childFiles.map((file) => (
            <div key={file.id}>
              <File file={file} />
            </div>
          ))
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
