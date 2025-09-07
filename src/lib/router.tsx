import { AuthPage } from "@/pages/auth";
import { createBrowserRouter } from "react-router-dom";
import Home from "@/pages/home";
import { PrivateRouteWrapper } from "./private-route";
import { PublicClientRequest } from "@/pages/public-client-request";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthPage />,
  },
  {
    path: "/public-client-request",
    element: <PublicClientRequest />,
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
