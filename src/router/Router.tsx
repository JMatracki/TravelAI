import { createBrowserRouter } from "react-router-dom";
import { HomePage } from "@/pages/HomePage";
import { NotFound } from "@/pages/NotFound";
import { Layout } from "@/pages/Layout";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default Router;
