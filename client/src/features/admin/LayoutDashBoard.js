import React from "react";
import { Outlet } from "react-router-dom";

import SideBarDesktop from "./SideBarDesktop";
import SideBarMobile from "./SideBarMobile";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import PersonIcon from "@mui/icons-material/Person";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import RedeemIcon from "@mui/icons-material/Redeem";
import HomeIcon from "@mui/icons-material/Home";

const menuItems = [
  { title: "Dashboard", to: "/admin/dashboard", icon: <ShowChartIcon /> },
  {
    title: "Sản phẩm",
    icon: <LocalMallIcon />,
    to: "/admin/products",
  },
  {
    title: "Đơn hàng",
    icon: <RedeemIcon />,
    to: "/admin/orders",
  },
  {
    title: "Người dùng",
    icon: <PersonIcon />,
    to: "/admin/users",
  },
];

const LayoutDashBoard = () => {
  return (
    <div className="container-cus wrapper">
      <div className="flex gap-x-4">
        {/* Sidebar */}
        <SideBarDesktop menuItems={menuItems} />

        <SideBarMobile menuItems={menuItems} />

        {/* Content */}
        <div className="grow mt-[60px] md:mt-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default LayoutDashBoard;
