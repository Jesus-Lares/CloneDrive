import { useEffect, useReducer } from "react";
import { useAuth } from "../context/AuthContext";
import { database } from "../firebase";

const ACTIONS = {
  GET_USERS: "get-users",
};

const reducer = (state, { type, payload }) => {
  switch (type) {
    case ACTIONS.GET_USERS:
      return {
        ...state,
        listUsers: payload.listUsers,
      };
    default:
      return state;
  }
};

export const useUsers = () => {
  const { currentUser } = useAuth();
  const [state, dispatch] = useReducer(reducer, {
    listUsers: [],
    user: null,
  });

  useEffect(() => {
    return database.users.onSnapshot(async (snapshot) => {
      const listUsers = await snapshot.docs.map(database.formatDoc);

      dispatch({
        type: ACTIONS.GET_USERS,
        payload: {
          listUsers: listUsers.filter((doc) => doc.id !== currentUser.id),
        },
      });
    });
  }, []);

  return state;
};
