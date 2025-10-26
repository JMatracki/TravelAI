import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import Router from "./router/Router.tsx";
import "./index.css";
import { RouterProvider } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <App>
    <RouterProvider router={Router} />
  </App>
);
