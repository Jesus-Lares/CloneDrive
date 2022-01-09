import React, { useState } from "react";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import {
  Avatar,
  Box,
  FormControlLabel,
  FormLabel,
  IconButton,
  Modal,
  Radio,
  RadioGroup,
} from "@mui/material";
import Input from "../Input/Input";

import "./ModalEdit.scss";
import { basicAlert } from "../Alert";
import { database, storage } from "../../firebase";

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

const ModalEdit = ({
  visible,
  onClose,
  selection,
  admin = false,
  setPhoto = () => {},
  visibleDelete = false,
}) => {
  const [image, setImage] = useState(null);
  const [inputs, setInputs] = useState({});
  const [url, setUrl] = useState(null);

  const deleteUser = async () => {
    if (selection?.photo !== null) {
      storage.ref(`/avatar/${selection.id}`).delete();
    }
    deleteFolder(selection, false, database.folders);
    await database.users
      .doc(selection.id)
      .delete()
      .then(() => {
        basicAlert("Usuario eliminado", "success");
      });
    onClose();
  };

  const deleteFile = async (file, alert, db = database.trashFiles) => {
    storage
      .ref(`/files/${file.location}`)
      .delete()
      .then(async () => {
        db.doc(file.id)
          .delete()
          .then(() => {
            if (alert) basicAlert("Archivo eliminado", "success");
          });
      })
      .catch((e) => {
        console.log(e);
        if (alert) basicAlert("Ocurrio un error al eliminar el archivo");
      });
  };
  const deleteFolder = async (
    folder = selection,
    alert,
    db = database.trashFolders
  ) => {
    await database.files
      .where("folderId", "==", folder.id)
      .get()
      .then((doc) => {
        doc.docs.map(async (doc) => {
          const childFile = await database.formatDoc(doc);
          deleteFile(childFile, false, database.files);
        });
      });
    await database.trashFiles
      .where("folderId", "==", folder.id)
      .get()
      .then((doc) => {
        doc.docs.map(async (doc) => {
          const childFile = await database.formatDoc(doc);
          deleteFile(childFile, false);
        });
      });
    await database.folders
      .where("parentId", "==", folder.id)
      .get()
      .then((doc) => {
        doc.docs.map(async (doc) => {
          const childFolder = await database.formatDoc(doc);
          deleteFolder(childFolder, false, database.folders);
        });
      });
    await database.trashFolders
      .where("parentId", "==", folder.id)
      .get()
      .then((doc) => {
        doc.docs.map(async (doc) => {
          const childFolder = await database.formatDoc(doc);
          deleteFolder(childFolder, false);
        });
      });
    await db
      .doc(folder.id)
      .delete()
      .then(() => {
        if (alert) basicAlert("Usuario eliminado", "success");
      });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (image !== null) {
      uploadFile(image);
    }
    database.users.doc(selection.id).update(inputs);
    if (admin) {
      database.folders.doc(selection.id).update({ type: inputs.type });
    }
    onClose();
  };
  const changeForm = (e) => {
    if (e.target.name === "image") {
      const file = e.target.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setUrl(reader.result);
      };
      setImage(file);
    } else {
      setInputs({
        ...inputs,
        [e.target.name]:
          e.target.name === "type"
            ? parseInt(e.target.value, 10)
            : e.target.value,
      });
    }
  };

  const uploadFile = async (file) => {
    const uploadTask = storage.ref(`/avatar/${selection.id}`).put(file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        /* Uploading File */
      },
      () => {
        /* Upload error */
        basicAlert("Ocurrio un error al cambiar la imagen", "error");
      },
      () => {
        /* Upload success */
        uploadTask.snapshot.ref.getDownloadURL().then((photo) => {
          database.users.doc(selection.id).update({ photo });
          setPhoto(photo);
        });
      }
    );
  };
  return (
    <div>
      <Modal
        open={visible}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {visibleDelete ? (
          <Box sx={{ ...style, width: 400 }}>
            <h3>
              ¿Estas seguro que deseas eliminar al usuario {selection.name}?
            </h3>
            <p>
              Esta acción sera permanente por lo que no se pondran recuperar los
              datos
            </p>
            <div className="buttons">
              <button onClick={onClose} className="btn grey">
                Cancelar
              </button>
              <button onClick={deleteUser} className="btn transparent">
                Eliminar
              </button>
            </div>
          </Box>
        ) : (
          <Box sx={{ ...style, width: 400 }}>
            <h3>Editar datos</h3>
            <form onChange={changeForm} onSubmit={handleSubmit}>
              <input
                accept="image/*"
                id="imageAvatar"
                className="avatar"
                type="file"
                name="image"
              />
              <label htmlFor="imageAvatar">
                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="span"
                >
                  <Avatar
                    sx={{ width: 100, height: 100 }}
                    src={url !== null ? url : selection.photo}
                  >
                    {selection.name[0]}
                  </Avatar>
                </IconButton>
              </label>
              <Input
                icon={faUser}
                name="name"
                value={selection.name}
                placeholder="Nombre"
              />
              {admin && (
                <>
                  <FormLabel component="legend">Tipo de usuario</FormLabel>
                  <RadioGroup
                    row
                    aria-label="gender"
                    defaultValue={`${selection.type}`}
                    name="type"
                  >
                    <FormControlLabel value="1" control={<Radio />} label="1" />
                    <FormControlLabel value="2" control={<Radio />} label="2" />
                    <FormControlLabel value="3" control={<Radio />} label="3" />
                  </RadioGroup>
                </>
              )}
              <div className="btns">
                <button
                  onClick={onClose}
                  type="button"
                  className="btn transparent"
                >
                  Cancelar
                </button>
                <input value="Cambiar" type="submit" className="btn " />
              </div>
            </form>
          </Box>
        )}
      </Modal>
    </div>
  );
};

export default ModalEdit;
