import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

//mui
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Divider from "@mui/material/Divider";
import CloseIcon from "@mui/icons-material/Close";
import StarIcon from "@mui/icons-material/Star";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { changeFilters, clearFilters, selectFilters } from "./filtersSlice";

const FilterMobile = ({ anchor = "right", isOpen, setIsOpen, listFilters }) => {
  const dispatch = useDispatch();

  const filters = useSelector(selectFilters);

  const [temporaryFilters, setTemporaryFilters] = useState({
    ratings: filters.ratings,
    seller: filters.seller,
    price: filters.price,
    category: filters.category,
  });

  const handleChangeFilters = (e) => {
    if (e.target.value === temporaryFilters[e.target.name]) {
      setTemporaryFilters({
        ...temporaryFilters,
        [e.target.name]: "",
      });
    } else {
      setTemporaryFilters({
        ...temporaryFilters,
        [e.target.name]: e.target.value,
      });
    }
  };

  const toggleDrawer = (open) => (event) => {
    if (!open) {
      setTemporaryFilters({
        ratings: filters.ratings,
        seller: filters.seller,
        price: filters.price,
      });
    }

    setIsOpen(open);
  };

  const handleApplyFilter = (e) => {
    e.preventDefault();

    dispatch(changeFilters({ ...temporaryFilters, page: 1 }));
    setIsOpen(false);
  };

  const resetFilters = (e) => {
    e.preventDefault();

    dispatch(clearFilters());
    setTemporaryFilters({
      ratings: "",
      seller: "",
      price: "",
      category: "",
    });
    setIsOpen(false);
  };

  useEffect(() => {
    setTemporaryFilters({
      ratings: filters.ratings,
      seller: filters.seller,
      price: filters.price,
      category: filters.category,
    });
  }, [JSON.stringify(filters)]);

  const renderLists = (anchor) => {
    return (
      <div
        className={`space-y-4 relative min-h-screen ${
          anchor === "top" || anchor === "bottom" ? "w-auto" : "w-[300px]"
        }`}
      >
        <div className="bg-primary px-2 py-3 text-center sticky top-0 left-0">
          <Tooltip title="Close Filter">
            <IconButton
              className="cursor-pointer !left-2 !absolute !top-1/2 !-translate-y-1/2"
              onClick={toggleDrawer(false)}
            >
              <CloseIcon className=" text-white !w-5 !h-5" />
            </IconButton>
          </Tooltip>
          <span className="text-sm font-semibold text-white ">
            Lọc sản phẩm
          </span>
        </div>

        <form className="px-3">
          {/* Content filter */}
          {Object.entries(listFilters).map(([key, val], i) => (
            <div key={i}>
              <p className="title-filter mb-4">{val.title}</p>

              <div className="grid grid-cols-2 gap-2">
                {val.childs.map((child, i) => (
                  <label key={i}>
                    <input
                      type="radio"
                      name={val.name}
                      value={child.value}
                      className="w-[1px] h-[1px] absolute peer"
                      onClick={handleChangeFilters}
                      checked={temporaryFilters[val.name] === child.value}
                      readOnly
                    />

                    <span className="py-2 px-0 filter-item peer-checked:!border-blue-500 peer-checked:!bg-blue-100 select-none">
                      {val.icons && (
                        <StarIcon className="text-yellow-400 !w-5 !h-5" />
                      )}

                      <span className="ml-[1px] select-none">{child.text}</span>
                    </span>
                  </label>
                ))}
              </div>

              <Divider className="!my-4" />
            </div>
          ))}

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-3 sticky bottom-0 left-0 bg-white py-4 px-3">
            <button
              className="text-sm font-semibold border-2 border-primary rounded text-primary h-[44px]"
              onClick={resetFilters}
            >
              Thiết lập lại
            </button>
            <button
              type="submit"
              className="text-sm font-semibold rounded bg-primary text-white h-[44px]"
              onClick={handleApplyFilter}
            >
              Áp dụng
            </button>
          </div>
        </form>
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

export default FilterMobile;
