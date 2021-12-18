import { useEffect, useReducer } from "react";
import { useAuth } from "../context/AuthContext";
import { database } from "../firebase";

const ACTIONS = {
  SELECT_FOLDER: "select-folder",
  UPDATE_FOLDER: "update-folder",
  SET_CHILD_FOLDERS: "set-child-folder",
  SET_CHILD_FILES: "set-child-files",
};
export const ROOT_FOLDER = { name: "Root", id: null, path: [] };
export const LEVEL1_FOLDER = { name: "Level1", id: null, path: [] };
export const LEVEL2_FOLDER = { name: "Level2", id: null, path: [] };

const reducer = (state, { type, payload }) => {
  switch (type) {
    case ACTIONS.SELECT_FOLDER:
      return {
        folderId: payload.folderId,
        folder: payload.folder,
        childFiles: [],
        childFolders: [],
      };
    case ACTIONS.UPDATE_FOLDER:
      return {
        ...state,
        folder: payload.folder,
      };
    case ACTIONS.SET_CHILD_FOLDERS:
      return {
        ...state,
        childFolders: payload.childFolders,
      };
    case ACTIONS.SET_CHILD_FILES:
      return {
        ...state,
        childFiles: payload.childFiles,
      };
    default:
      return state;
  }
};

export const useFolder = (folderId = null, mainFolder = "") => {
  const [state, dispatch] = useReducer(reducer, {
    folderId,
    folder: null,
    childFolders: [],
    childFiles: [],
  });
  const { currentUser } = useAuth();
  const path = mainFolder === "" || mainFolder === "folder" ? null : mainFolder;

  useEffect(() => {
    dispatch({
      type: ACTIONS.SELECT_FOLDER,
      payload: { folderId, folder: null },
    });
  }, [folderId]);

  useEffect(() => {
    if (folderId !== null) {
      return database.folders
        .doc(folderId)
        .get()
        .then((doc) => {
          dispatch({
            type: ACTIONS.UPDATE_FOLDER,
            payload: { folder: database.formatDoc(doc) },
          });
        });
    } else {
      if (path === null) {
        folderId = currentUser.id;
        return database.folders
          .doc(folderId)
          .get()
          .then((doc) => {
            dispatch({
              type: ACTIONS.UPDATE_FOLDER,
              payload: { folder: database.formatDoc(doc) },
            });
          });
      } else {
        if (path === "level1") {
          dispatch({
            type: ACTIONS.UPDATE_FOLDER,
            payload: { folder: LEVEL1_FOLDER },
          });
        } else {
          dispatch({
            type: ACTIONS.UPDATE_FOLDER,
            payload: { folder: LEVEL2_FOLDER },
          });
        }
      }
    }
  }, [folderId, mainFolder]);

  useEffect(() => {
    return fetchData(
      database.folders,
      ACTIONS.SET_CHILD_FOLDERS,
      { childFolders: [] },
      path,
      "childFolders",
      currentUser,
      folderId,
      dispatch
    );
  }, [folderId, currentUser, mainFolder]);
  useEffect(() => {
    return fetchData(
      database.files,
      ACTIONS.SET_CHILD_FILES,
      { childFiles: [] },
      path,
      "childFiles",
      currentUser,
      folderId,
      dispatch
    );
  }, [folderId, currentUser, mainFolder]);

  return state;
};

const fetchData = (
  db,
  type,
  payload,
  path,
  file,
  currentUser,
  folderId,
  dispatch
) => {
  const typeFolder = path === "level1" ? 1 : 2;
  const search = file === "childFiles" ? "folderId" : "parentId";

  if (path === null) {
    return db
      .where(search, "==", folderId)
      .where("userId", "==", currentUser.id)
      .onSnapshot((snapshot) => {
        payload[file] = snapshot.docs.map(database.formatDoc);
        dispatch({
          type,
          payload,
        });
      });
  } else {
    if (typeFolder < currentUser.type) {
      return db
        .where(search, "==", folderId)
        .where("type", "==", typeFolder)
        .onSnapshot((snapshot) => {
          payload[file] = snapshot.docs.map(database.formatDoc);
          dispatch({
            type,
            payload,
          });
        });
    } else {
      return dispatch({
        type: type,
        payload,
      });
    }
  }
};
