import React from "react";
import { Link } from "react-router-dom";

const SideBarDesktop = ({ menuItems }) => {
  return (
    <div className="border w-[200px] h-fit min-h-screen lg:w-[240px] hidden md:block bg-primary shrink-0 sticky top-0 text-white font-semibold py-4">
      <div className="flex justify-center mb-4">
        <Link className="space-y-2 cursor-pointer flex items-center" to="/">
          <img
            src="https://salt.tikicdn.com/ts/upload/ae/f5/15/2228f38cf84d1b8451bb49e2c4537081.png"
            alt="tiki-logo"
            className="w-[60px] h-[40px] object-contain"
          />
        </Link>
      </div>

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
  );
};

export default SideBarDesktop;
