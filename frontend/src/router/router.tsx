import { createBrowserRouter, Navigate } from "react-router-dom";
import Register from "@/pages/Register";
import Login from "@/pages/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />
  },
  {
    path: "/login",
    Component: Login
  },
  {
    path: "/register",
    Component: Register
  }
]);

export default router;