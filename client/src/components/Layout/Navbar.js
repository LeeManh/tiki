//lib
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
//
import {
  selectIsAuthenticated,
  selectUser,
  logoutUser,
} from "../../features/auth/authSlice";
import MenuMoblie from "./MenuMoblie";
import useShowElement from "../../hooks/useShowElement";
//mui
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Badge from "@mui/material/Badge";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import { clearCart, selectCartitems } from "../../features/cart/cartSlice";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FeaturedPlayListIcon from "@mui/icons-material/FeaturedPlayList";
import { clearFavourite } from "../../features/favourite/favouriteSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const cartItems = useSelector(selectCartitems);
  const isShow = useShowElement({ allowedRoles: ["admin"] });

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const lists = [
    {
      title: "",
      childs: [
        {
          label: "Trang chủ",
          icon: <HomeIcon className="text-secondary" />,
          to: "/",
        },
        {
          label: "Quản lý tài khoản",
          icon: <AccountCircleIcon className="text-secondary " />,
          to: "/me/edit",
        },
        isShow
          ? {
              label: "Dash Board",
              icon: <ShowChartIcon className="text-secondary " />,
              to: "/admin/dashboard",
            }
          : null,
      ],
    },
    {
      title: "",
      childs: [
        {
          label: "Giỏ hàng",
          icon: <LocalMallIcon className="text-secondary" />,
          to: "/cart",
        },
        {
          label: "Sản phẩm yêu thích",
          icon: <FavoriteIcon className="text-secondary" />,
          to: "/me/favourite",
        },
        {
          label: "Đơn hàng",
          icon: <FeaturedPlayListIcon className="text-secondary" />,
          to: "/me/orders",
        },
      ],
    },
    {
      title: "",
      childs: [
        isAuthenticated
          ? {
              label: "Đăng xuất",
              icon: <LogoutIcon className="text-secondary" />,
              method: () => handleLogout(),
            }
          : {
              label: "Đăng nhập",
              icon: <LogoutIcon className="text-secondary" />,
              to: "/login",
            },
      ],
    },
  ];

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(clearCart());
    dispatch(clearFavourite());
  };

  const handleChangeSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleEnterSearch = (e) => {
    const key = e.keyCode ? e.keyCode : e.which;

    if (key === 13) {
      navigate(`/search?q=${search}`);
    }
  };

  const handleSearchClick = (e) => {
    navigate(`/search?q=${search}`);
  };

  return (
    <div className=" bg-primary ">
      <div className="container-cus flex items-center justify-between md:py-3 py-2 wrapper">
        {/* logo */}
        <div
          className="space-y-2 cursor-pointer hidden md:block"
          onClick={() => navigate("/")}
        >
          <img
            src="https://salt.tikicdn.com/ts/upload/ae/f5/15/2228f38cf84d1b8451bb49e2c4537081.png"
            alt="tiki-logo"
            className="w-[60px] h-[40px] object-contain"
          />
          <img
            src="https://salt.tikicdn.com/ts/brickv2og/70/07/62/9a90de2324bda05df7ff137972de1c70.png"
            alt=""
            className="w-[129px] h-[18px] object-contain"
          />
        </div>
        {/* Icon Menu */}
        <div className="md:hidden">
          <MenuIcon
            className="text-white cursor-pointer"
            onClick={() => setIsOpen(true)}
          />
        </div>
        {/* Input search */}
        <div className="flex items-center rounded bg-white px-2 py-1 md:py-2 space-x-2 max-w-[600px] mx-4 md:mx-8 grow">
          <SearchIcon
            className="text-secondary cursor-pointer"
            onClick={handleSearchClick}
          />
          <input
            type="text"
            placeholder="Bạn đang tìm kiếm gì"
            className="border-none bg-transparent outline-none text-sm text-secondary grow"
            value={search}
            onChange={handleChangeSearch}
            onKeyPress={handleEnterSearch}
          />
        </div>

        {/* Icons */}
        <div className="flex items-center md:space-x-4">
          <div className="hidden md:block relative">
            {isAuthenticated && (
              <>
                <div className="flex items-end space-x-2 peer before:absolute before:w-full before:h-[15px] before:top-full">
                  {/* <PersonIcon className="text-white cursor-pointer icon-nav" /> */}
                  <Avatar alt={user.name} src={user.avatar.url} />
                  <div className="flex flex-col">
                    <span className="text-[12px] text-white hidden md:inline-block cursor-pointer">
                      <span>Tài Khoản</span>
                    </span>
                    <span className="text-[12px] text-white hidden md:flex items-center cursor-pointer first-letter:uppercase">
                      <span> {user.name}</span>
                      <ArrowDropDownIcon />
                    </span>
                  </div>
                </div>
                <div className="z-[100] hover:block peer-hover:block hidden absolute w-[250px] left-1/2 -translate-x-1/2 bg-white shadow-sm rounded p-4 space-y-4 top-[calc(100%+10px)]">
                  {/* Menu */}
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
                                <span className="text-text text-sm ">
                                  {child.label}
                                </span>
                              </Link>
                            );
                          })}
                        </div>
                        {index !== lists.length - 1 && (
                          <Divider className="pt-4" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
            {!isAuthenticated && (
              <div
                className="flex items-end space-x-2"
                onClick={() => navigate("/login")}
              >
                <PersonIcon className="text-white cursor-pointer icon-nav" />
                <div className="flex flex-col">
                  <span className="text-[12px] text-white hidden md:inline-block cursor-pointer">
                    Đăng nhập / Đăng ký
                  </span>
                  <span className="text-[12px] text-white hidden md:flex items-center cursor-pointer">
                    <span> Tài Khoản</span>
                    <ArrowDropDownIcon />
                  </span>
                </div>
              </div>
            )}
          </div>

          <div
            className="flex items-end space-x-2"
            onClick={() => navigate("/cart")}
          >
            <Badge badgeContent={cartItems.length || 0} color="error" max={99}>
              <LocalMallIcon className="text-white cursor-pointer icon-nav" />
            </Badge>
            <span className="text-[12px] text-white hidden md:inline-block">
              Giỏ hàng
            </span>
          </div>
        </div>

        {/* Menu mobile */}
        <MenuMoblie
          anchor="left"
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          lists={lists}
        />
      </div>
    </div>
  );
};

export default Navbar;
