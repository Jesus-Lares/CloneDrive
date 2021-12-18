import React, { useState } from "react";
import { Modal, Box } from "@mui/material";
import { v4 as uuidV4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolder,
  faPlusCircle,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import Input from "../Input";
import ProgressModal from "../ProgressModal";
import FolderBreadcrumbs from "../FolderBreadcrumbs";

import { basicAlert } from "../Alert";
import { database, storage } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import { ROOT_FOLDER } from "../../hooks/useFolder";
import "./ContentBar.scss";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};
const ContentBar = ({ currentFolder, mainPath }) => {
  const { currentUser } = useAuth();
  const [visible, setVisible] = useState(false);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [nameFolder, setNameFolder] = useState("");

  const changeForm = (e) => {
    setNameFolder(e.target.value);
  };
  const closeModal = () => {
    setVisible(false);
    setNameFolder("");
  };
  const closeModalProgress = () => {
    setUploadFiles([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentFolder === null) return;

      const path = [...currentFolder.path];

      if (currentFolder !== ROOT_FOLDER) {
        path.push({ name: currentFolder.name, id: currentFolder.id });
      }
      let type = currentUser.type;
      if (mainPath !== null) {
        if (mainPath === "level2") {
          type = 2;
        } else {
          type = 1;
        }
      }
      await database.folders.add({
        name: nameFolder,
        userId: currentUser.id,
        parentId: currentFolder.id,
        path,
        createAt: database.getCurrentTimestamp(),
        type,
      });

      basicAlert("Carpeta creada");
      closeModal();
    } catch (error) {
      console.log(error);
      basicAlert(error.code, "error");
    }
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (currentFolder === null || file === null) return;

    database.files
      .where("name", "==", file.name)
      .where("userId", "==", currentUser.id)
      .where("folderId", "==", currentFolder.id)
      .get()
      .then((existingFiles) => {
        const existingFile = existingFiles.docs[0];
        if (existingFile) {
          basicAlert("Ya cuentas con un archivo con el mismo nombre", "error");
        } else {
          uploadFile(file);
        }
      });
  };
  const uploadFile = (file) => {
    const id = uuidV4();

    setUploadFiles((prevUpload) => [
      ...prevUpload,
      { id, name: file.name, progress: 0, error: false },
    ]);
    const filePath =
      currentFolder === ROOT_FOLDER
        ? `${currentFolder.path.join("/")}/${file.name}`
        : `${currentFolder.path.join("/")}/${currentFolder.name}/${file.name}`;

    const uploadTask = storage.ref(`/files/${filePath}`).put(file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        /* Uploading File */
        let progress = snapshot.bytesTransferred / snapshot.totalBytes;
        progress = Math.round(progress * 100);
        setUploadFiles((prevUpload) => {
          return prevUpload.map((uploadFile) => {
            if (uploadFile.id === id) {
              return { ...uploadFile, progress };
            }
            return uploadFile;
          });
        });
      },
      () => {
        /* Upload error */
        setUploadFiles((prevUpload) => {
          return prevUpload.map((uploadFile) => {
            if (uploadFile.id === id) {
              return { ...uploadFile, error: true };
            }
            return uploadFile;
          });
        });
      },
      () => {
        /* Upload success */
        uploadTask.snapshot.ref.getDownloadURL().then((url) => {
          database.files.add({
            url,
            name: file.name,
            type: currentUser.type,
            typeFile: file.type,
            size: file.size,
            createdAt: database.getCurrentTimestamp(),
            folderId: currentFolder.id,
            userId: currentUser.id,
          });
        });
      }
    );
  };
  return (
    <div className="contentBar">
      <FolderBreadcrumbs
        id={currentUser.id}
        mainPath={mainPath}
        currentFolder={currentFolder}
      />
      <div className="uploadContent">
        <button onClick={() => setVisible(true)}>
          <FontAwesomeIcon icon={faPlusCircle} />
          Nueva Carpeta
        </button>
        <label>
          <FontAwesomeIcon icon={faUpload} />
          <input
            type="file"
            onChange={handleUpload}
            style={{ opacity: 0, position: "absolute", left: "-9999px" }}
          />
          Subir archivo
        </label>
      </div>
      <Modal
        open={visible}
        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>
          <h3>Nueva Carpeta</h3>
          <form onChange={changeForm} onSubmit={handleSubmit}>
            <Input icon={faFolder} name="folder" placeholder="Nombre" />
            <div>
              <button onClick={closeModal} className="btn transparent">
                Cancelar
              </button>
              <input value="Crear" type="submit" className="btn " />
            </div>
          </form>
        </Box>
      </Modal>
      {uploadFiles.length > 0 && (
        <ProgressModal files={uploadFiles} closeModal={closeModalProgress} />
      )}
    </div>
  );
};

export default ContentBar;
