import { createBrowserRouter, Navigate } from "react-router-dom";
import Register from "@/pages/Register";
import Login from "@/pages/Login";
import PageLayout from "@/layouts/PageLayout";
import HomePage from "@/pages/HomePage";

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
  },
  {
    path: "/",
    Component: PageLayout,
    children: [
      {
        path: "home",
        Component: HomePage
      }
    ]
  }
]);

export default router;