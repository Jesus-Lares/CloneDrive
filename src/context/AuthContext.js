import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { basicAlert } from "../components/Alert";
import { auth, database } from "../firebase";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const signup = async (user) => {
    await auth
      .createUserWithEmailAndPassword(user.email, user.password)
      .then(async () => {
        await database.users.doc(auth.currentUser.uid).set({
          name: user.username,
          type: 1,
          photo: auth.currentUser.photoURL,
          email: user.email,
          createAt: database.getCurrentTimestamp(),
        });

        await database.folders.doc(auth.currentUser.uid).set({
          name: auth.currentUser.uid,
          userId: auth.currentUser.uid,
          parentId: null,
          path: [],
          type: 1,
          createAt: database.getCurrentTimestamp(),
        });
      })
      .catch((e) => {
        console.log("Error in create user: ", e);
      });
  };
  const login = async (user) => {
    await auth.signInWithEmailAndPassword(user.email, user.password);
  };
  const logout = (navigate) => {
    auth.signOut().then(() => {
      navigate("/login");
    });
    return null;
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user !== null) {
        const response = await database.users.doc(user.uid).get();
        if (!response.exists) {
          setCurrentUser(null);
          setPhoto(null);
          await auth.currentUser.delete().then(() => {
            basicAlert(
              "Tu usuario fue eliminado por un administrador",
              "warning"
            );
            logout(navigate);
          });
        } else {
          const data = database.formatDoc(response);
          setCurrentUser(data);
          setPhoto(data.photo);
        }
      } else {
        setCurrentUser(null);
        setPhoto(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    photo,
    setPhoto,
    signup,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
