import { createBrowserRouter, Navigate } from "react-router-dom";
import Register from "@/pages/Register";
import Login from "@/pages/Login";
import PageLayout from "@/layouts/PageLayout";
import HomePage from "@/pages/HomePage";
import CoursesPage from "@/pages/CoursesPage";
import ProfilePage from "@/pages/ProfilePage";

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
      },
      {
        path: "courses",
        Component: CoursesPage
      },
      {
        path: "profile",
        Component: ProfilePage
      }
    ]
  }
]);

export default router;