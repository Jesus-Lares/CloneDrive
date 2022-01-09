import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar } from "@mui/material";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useUsers } from "../../hooks/useUsers";

import ModalEdit from "../../components/ModalEdit/ModalEdit";

import "./Admin.scss";
const Admin = () => {
  const [visible, setVisible] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [selection, setSelection] = useState(null);
  const { listUsers } = useUsers();

  const editUsers = (user) => {
    setSelection(user);
    setVisible(true);
  };
  const deleteUsers = (user) => {
    setSelection(user);
    setVisibleDelete(true);
    setVisible(true);
  };
  const closeModal = () => {
    setVisible(false);
    setVisibleDelete(false);
    setSelection(null);
  };
  return (
    <div className="users">
      <div className="users_header"></div>
      <ul className="users_list">
        {listUsers.map((users) => (
          <li key={users.id}>
            <Avatar src={users.photo}>{users.name[0]}</Avatar>

            <div>
              <h4>{users.name}</h4>
              <p>{users.id}</p>
            </div>
            <div>
              <FontAwesomeIcon
                size="lg"
                onClick={() => editUsers(users)}
                icon={faEdit}
              />
              <FontAwesomeIcon
                size="lg"
                onClick={() => deleteUsers(users)}
                icon={faTrash}
              />
            </div>
          </li>
        ))}
      </ul>
      {selection !== null && (
        <ModalEdit
          visible={visible}
          selection={selection}
          onClose={closeModal}
          admin={true}
          visibleDelete={visibleDelete}
        />
      )}
    </div>
  );
};

export default Admin;
