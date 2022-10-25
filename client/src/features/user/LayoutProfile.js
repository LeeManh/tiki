import React from "react";
import { Outlet, Link } from "react-router-dom";

import Navbar from "../../components/Layout/Navbar";
import PersonIcon from "@mui/icons-material/Person";
import FeaturedPlayListIcon from "@mui/icons-material/FeaturedPlayList";
import FavoriteIcon from "@mui/icons-material/Favorite";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

const BootstrapTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
  },
}));

const itemsSidebar = [
  { title: "Thông tin tài khoản", to: "/me/edit", icon: <PersonIcon /> },
  {
    title: "Quản lý đơn hàng",
    to: "/me/orders",
    icon: <FeaturedPlayListIcon />,
  },
  { title: "Sản phẩm yêu thích", to: "/me/favourite", icon: <FavoriteIcon /> },
];

const LayoutProfile = () => {
  return (
    <>
      <Navbar />

      <div className="flex gap-4 container-cus wrapper mt-4">
        <div className="lg:w-[200px] rounded  space-y-2 shrink-0">
          {itemsSidebar.map((item, index) => (
            <BootstrapTooltip
              title={item.title}
              arrow
              key={index}
              placement="right"
              className="lg:hidden"
            >
              <Link
                to={item.to}
                className="flex items-center gap-x-3 text-secondary py-2 px-2 rounded hover:bg-[#ebebf0]"
              >
                {item.icon}
                <span className="text-sm font-semibold hidden lg:inline">
                  {item.title}
                </span>
              </Link>
            </BootstrapTooltip>
          ))}
        </div>

        <div className="grow bg-white rounded shadow p-2">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default LayoutProfile;
