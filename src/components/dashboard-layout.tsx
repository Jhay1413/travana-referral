import { Header } from "./header";
import { Outlet } from "react-router-dom";

export const DashboardLayout = () => {
  return (
    <div className="">
      <Header />
      <Outlet />
    </div>
  );
};
