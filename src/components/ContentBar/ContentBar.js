import React, { useEffect, useRef, useState } from "react";
import { Modal, Box } from "@mui/material";
import { v4 as uuidV4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolder,
  faInfoCircle,
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
import { useNavigate } from "react-router-dom";

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
const ContentBar = ({
  currentFolder,
  mainPath,
  selection,
  setSelection,
  setFile,
}) => {
  const { currentUser } = useAuth();
  const typeSelection = useRef(true);
  const pathLink = mainPath === null ? "" : `/${mainPath}`;
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [nameFolder, setNameFolder] = useState("");

  const changeForm = (e) => {
    setNameFolder(e.target.value);
  };
  const closeModal = () => {
    setVisible(false);
    setEditVisible(false);
    setNameFolder("");
  };
  const closeModalProgress = () => {
    setUploadFiles([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (nameFolder.trim() === "")
        return basicAlert("Debe ingresar un nombre", "warning");
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

  const deleteSelection = () => {
    if (typeSelection.current) {
      deleteFolder();
    } else {
      deleteFile();
    }
    setSelection(null);
  };
  const deleteFile = async () => {
    const trash = {
      ...selection,
      deletedAt: database.getCurrentTimestamp(),
      deletedBy: currentUser.id,
    };
    await database.trash.doc(selection.id).set(trash);
    database.files
      .doc(selection.id)
      .delete()
      .then(() => {
        basicAlert("Archivo enviado a la papelera", "success");
      });
  };
  const deleteFolder = async () => {
    console.log(selection);
    const trash = {
      ...selection,
      deletedAt: database.getCurrentTimestamp(),
      deletedBy: currentUser.id,
    };
    await database.trash.doc(selection.id).set(trash);
    database.folders
      .doc(selection.id)
      .delete()
      .then(() => {
        basicAlert("Carpeta enviada a la papelera", "success");
      });
  };
  const editName = async (e) => {
    e.preventDefault();
    if (nameFolder.trim() === "")
      return basicAlert("Debe ingresar un nombre", "warning");
    let db = null;
    let name = nameFolder;
    if (typeSelection.current) {
      db = database.folders;
    } else {
      db = database.files;
      const split = selection.name.split(".");
      name += "." + split[split.length - 1];
    }
    db.doc(selection.id).update({
      name,
    });
    basicAlert("El nombre se cambio con exito");
    closeModal();
  };

  useEffect(() => {
    if (selection?.folderId) {
      typeSelection.current = false;
    } else {
      typeSelection.current = true;
    }
  }, [selection]);
  useEffect(() => {
    setSelection(null);
    window.addEventListener("click", (e) => {
      if (document.getElementById("infoSelection")) {
        if (!document.getElementById("infoSelection").contains(e.target)) {
          setOptionsVisible(false);
        }
      }
    });
    return window.removeEventListener("click", () => {});
  }, []);
  return (
    <div className="contentBar">
      <FolderBreadcrumbs
        id={currentUser.id}
        mainPath={mainPath}
        currentFolder={currentFolder}
      />
      <div className="uploadContent">
        {selection !== null && (
          <div id="infoSelection">
            <button onClick={() => setOptionsVisible((v) => !v)}>
              <FontAwesomeIcon icon={faInfoCircle} />
            </button>
            {optionsVisible && (
              <div className="optionsSelection">
                <ul>
                  <li>
                    <button
                      onClick={() => {
                        if (typeSelection.current) {
                          navigate(`${pathLink}/folder/${selection.id}`);
                        } else {
                          setFile(selection);
                        }
                      }}
                    >
                      Abrir
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setEditVisible(true);
                        if (selection.name.split(".").length > 1) {
                          setNameFolder(
                            selection.name.split(".").slice(0, -1).join(".")
                          );
                        } else {
                          setNameFolder(selection.name);
                        }
                        setVisible(true);
                      }}
                    >
                      Cambiar nombre
                    </button>
                  </li>
                  <li>
                    <button onClick={deleteSelection}>Eliminar</button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
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
          <h3>{editVisible ? "Cambiar nombre" : "Nueva carpeta"}</h3>
          <form
            onChange={changeForm}
            onSubmit={editVisible ? editName : handleSubmit}
          >
            <Input
              icon={faFolder}
              name="folder"
              value={nameFolder}
              placeholder="Nombre"
            />
            <div>
              <button onClick={closeModal} className="btn transparent">
                Cancelar
              </button>
              <input
                value={editVisible ? "Cambiar" : "Crear"}
                type="submit"
                className="btn "
              />
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
