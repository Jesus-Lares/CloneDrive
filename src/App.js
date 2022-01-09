import React from "react";
import {
  BrowserRouter as Router,
  useRoutes,
  useLocation,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./Layout/Layout";
import Admin from "./pages/Admin/Admin";
import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./pages/Login";
import Trash from "./pages/Trash";

const App = () => {
  let routes = useRoutes([
    { path: "/login", element: <Login /> },
    {
      path: "/",
      element: (
        <RequireAuth>
          <Dashboard />
        </RequireAuth>
      ),
    },
    {
      path: "/level2",
      element: (
        <RequireAuth>
          <Dashboard />
        </RequireAuth>
      ),
    },
    {
      path: "/level2/folder/:folderId",
      element: (
        <RequireAuth>
          <Dashboard />
        </RequireAuth>
      ),
    },
    {
      path: "/level1",
      element: (
        <RequireAuth>
          <Dashboard />
        </RequireAuth>
      ),
    },
    {
      path: "/level1/folder/:folderId",
      element: (
        <RequireAuth>
          <Dashboard />
        </RequireAuth>
      ),
    },
    {
      path: "/folder/:folderId",
      element: (
        <RequireAuth>
          <Dashboard />
        </RequireAuth>
      ),
    },
    {
      path: "/trash",
      element: (
        <RequireAuth>
          <Trash />
        </RequireAuth>
      ),
    },
    {
      path: "/users",
      element: (
        <RequireAdmin>
          <Admin />
        </RequireAdmin>
      ),
    },
  ]);
  return <>{routes}</>;
};

const RequireAuth = ({ children }) => {
  let { currentUser } = useAuth();
  let location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return <>{children}</>;
};
const RequireAdmin = ({ children }) => {
  let { currentUser } = useAuth();
  let location = useLocation();

  if (currentUser?.type !== 3) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return <>{children}</>;
};

const AppWrapper = () => {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <App />
        </Layout>
      </AuthProvider>
    </Router>
  );
};
export default AppWrapper;
