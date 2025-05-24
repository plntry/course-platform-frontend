import React from "react";
import { createBrowserRouter, RouterProvider, RouteObject } from "react-router";
import "./App.css";
import { routes } from "./routes";

const App: React.FC = () => {
  const router = createBrowserRouter(routes as RouteObject[]);
  return <RouterProvider router={router} />;
};

export default App;
