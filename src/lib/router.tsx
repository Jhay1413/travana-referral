import { AuthPage } from "@/pages/auth";
import { createBrowserRouter } from "react-router-dom";
import Home from "@/pages/home";
import { PrivateRouteWrapper } from "./private-route";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthPage />,
  },
  {
    path: "/dashboard",
    element: <PrivateRouteWrapper />,
    children: [
      {
        path: "/dashboard",
        element: <Home />,
      },
    ],
  }

]);
