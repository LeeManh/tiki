import React, { useState } from "react";
import { Link } from "react-router-dom";

import MenuIcon from "@mui/icons-material/Menu";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import HomeIcon from "@mui/icons-material/Home";

const SideBarMobile = ({ menuItems }) => {
  const [state, setState] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState(open);
  };

  const list = () => (
    <Box
      className="!w-[250px]"
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <div className="">
        {menuItems.map((item, index) => (
          <Link
            to={item?.to}
            key={index}
            className="px-4 py-3 flex items-center gap-x-2 cursor-pointer hover:bg-black/10 duration-200"
          >
            {item?.icon && item.icon}
            <span className="text-sm font-semibold">{item.title}</span>
          </Link>
        ))}
      </div>
      <Divider />
    </Box>
  );

  return (
    <>
      <div className="h-[60px] fixed top-0 left-1/2 -translate-x-1/2 w-full md:hidden z-[200]">
        <div className="px-4 bg-primary h-full flex items-center justify-between">
          <Link to="/">
            <HomeIcon className="text-white cursor-pointer !w-6 !h-6" />
          </Link>

          <MenuIcon
            className="text-white cursor-pointer !w-6 !h-6"
            onClick={toggleDrawer(true)}
          />
        </div>
      </div>

      <Drawer anchor="left" open={state} onClose={toggleDrawer(false)}>
        {list()}
      </Drawer>
    </>
  );
};

export default SideBarMobile;
