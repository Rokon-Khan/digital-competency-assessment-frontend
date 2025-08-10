// import { Layout } from "@/components/Layout";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import { createBrowserRouter } from "react-router";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    // children: [{ index: true, element: <Home /> }],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
