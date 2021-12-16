import React from "react";
import {
  BrowserRouter as Router,
  useRoutes,
  useLocation,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./pages/Login";

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
      path: "/component2",
      element: (
        <RequireAuth>
          <Dashboard />
        </RequireAuth>
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

  return children;
};

const AppWrapper = () => {
  return (
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  );
};
export default AppWrapper;
