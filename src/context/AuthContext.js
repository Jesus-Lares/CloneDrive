import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const signup = async (user) => {
    await auth
      .createUserWithEmailAndPassword(user.email, user.password)
      .then(async () => {
        const update = await auth.currentUser;
        await update
          .updateProfile({ displayName: `*-3-*${user.username}` })
          .catch((e) => {
            console.log("update", e);
          });
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
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
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
