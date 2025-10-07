import { AuthPage } from "@/pages/auth";
import { createBrowserRouter } from "react-router-dom";
import Home from "@/pages/home";
import { PrivateRouteWrapper } from "./private-route";
import { PublicClientRequest } from "@/pages/public-client-request";
import { ReferralsListPage } from "@/pages/referrals-list";
import { CommissionsListPage } from "@/pages/commissions-list";
import { UserProfile } from "@/pages/user-profile";
import MembersPage from "@/pages/members";
import InvitationPage from "@/pages/invitation";
import VerifyEmailPage from "@/pages/verify-email";
import { DashboardLayout } from "@/components/dashboard-layout";

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
    path: "/verify-email",
    element: <VerifyEmailPage />,
  },
  {
    path: "/dashboard",
    element: <PrivateRouteWrapper />,

    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <Home />,
          },
          {
            path: "referrals",
            element: <ReferralsListPage />,
          },
          {
            path: "commissions",
            element: <CommissionsListPage />,
          },
          {
            path: "profile",
            element: <UserProfile />,
          },
          {
            path: "members",
            element: <MembersPage />,
          },
          {
            path: "invitation/:token",
            element: <InvitationPage />,
          },
        ],
      },
    ],
  },
]);
