import { PATHS } from "./paths";
import Home from "../pages/Home";
import AuthPage from "../pages/AuthPage";
import ErrorPage from "../pages/ErrorPage";
import { rootLoader, protectedLoader } from "../utils/authUtils";
import { action as logoutAction } from "../pages/Logout";
import RootLayout from "../pages/RootLayout";
import Loader from "../components/Loader";

export const routes = [
  {
    id: "root",
    path: PATHS.HOME,
    element: <RootLayout />,
    loader: rootLoader,
    HydrateFallback: Loader,
    children: [
      {
        index: true,
        element: <Home />,
        // loader: protectedLoader,
      },
      {
        path: PATHS.LOGOUT,
        // action: logoutAction,
      },
      {
        path: PATHS.NOT_FOUND,
        element: <ErrorPage />,
      },
    ],
  },
  {
    path: PATHS.AUTH,
    element: <AuthPage />,
  },
];
