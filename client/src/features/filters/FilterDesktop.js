import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import Divider from "@mui/material/Divider";
import StarIcon from "@mui/icons-material/Star";
import { changeFilters, clearFilters, selectFilters } from "./filtersSlice";

const FilterDesktop = ({ listFilters }) => {
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

  const handleApplyFilter = (e) => {
    e.preventDefault();

    dispatch(changeFilters({ ...temporaryFilters, page: 1 }));
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
  };

  useEffect(() => {
    setTemporaryFilters({
      ratings: filters.ratings,
      seller: filters.seller,
      price: filters.price,
      category: filters.category,
    });
  }, [JSON.stringify(filters)]);

  return (
    <div className="bg-white rounded md:block hidden w-[200px] lg:w-[220px] shadow shrink-0 p-2">
      <form className="px-3">
        {/* Content filter */}
        {Object.entries(listFilters).map(([key, val], i) => (
          <div key={i}>
            <p className="title-filter mb-4">{val.title}</p>

            <div className="flex flex-col gap-2">
              {val.childs.map((child, i) => (
                <label
                  key={i}
                  className="flex items-center gap-x-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name={val.name}
                    value={child.value}
                    className=""
                    onClick={handleChangeFilters}
                    checked={temporaryFilters[val.name] === child.value}
                    readOnly
                  />

                  <span className="text-sm">
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
        <div className="space-y-2">
          <button
            className="text-sm font-semibold border-2 border-primary rounded text-primary w-full py-2"
            onClick={resetFilters}
          >
            Thiết lập lại
          </button>
          <button
            type="submit"
            className="text-sm font-semibold rounded bg-primary text-white w-full py-2"
            onClick={handleApplyFilter}
          >
            Áp dụng
          </button>
        </div>
      </form>
    </div>
  );
};

export default FilterDesktop;
