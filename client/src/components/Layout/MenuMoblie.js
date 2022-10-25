import React from "react";
import { Link } from "react-router-dom";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Divider from "@mui/material/Divider";

const MenuMoblie = ({ anchor, isOpen, setIsOpen, lists }) => {
  const toggleDrawer = (open) => (event) => {
    setIsOpen(open);
  };

  const renderLists = (anchor) => {
    return (
      <div
        onClick={toggleDrawer(false)}
        className={`p-4 space-y-4 ${
          anchor === "top" || anchor === "bottom" ? "w-auto" : "w-[250px]"
        }`}
      >
        {lists.map((list, index) => {
          return (
            <div key={index}>
              {list.title && <p>{list.title}</p>}
              <div className="space-y-4">
                {list.childs.map((child, i) => {
                  return child === null ? (
                    ""
                  ) : (
                    <Link
                      key={i}
                      className="space-x-4 cursor-pointer block"
                      to={child.to}
                      onClick={child.method}
                    >
                      {child.icon}
                      <span className="text-text text-sm ">{child.label}</span>
                    </Link>
                  );
                })}
              </div>
              {index !== lists.length - 1 && <Divider className="pt-4" />}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <SwipeableDrawer
        anchor={anchor}
        open={isOpen}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        {renderLists(anchor)}
      </SwipeableDrawer>
    </>
  );
};

export default MenuMoblie;
