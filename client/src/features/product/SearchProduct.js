import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createStructuredSelector } from "reselect";
import { useLocation } from "react-router-dom";

import MetaData from "../../components/Layout/MetaData";
import Navbar from "../../components/Layout/Navbar";
import ListProducts from "./ListProducts";
import Pagination from "@mui/material/Pagination";
import {
  changeFilters,
  clearFilters,
  selectFilters,
} from "../filters/filtersSlice";
import {
  fetchProducts,
  selectProducts,
  selectProductsPerPage,
  selectStatusProducts,
  selectTotalProducts,
} from "./productsSlice";
import useUrlSearchParams from "../../hooks/useUrlSearchParams";
import LinearProgress from "@mui/material/LinearProgress";

const SearchProduct = () => {
  const dispatch = useDispatch();
  const { search } = useLocation();

  const searchQuery = new URLSearchParams(search).get("q");

  const { products, statusProducts, total, limit } = useSelector(
    createStructuredSelector({
      products: selectProducts,
      statusProducts: selectStatusProducts,
      total: selectTotalProducts,
      limit: selectProductsPerPage,
    })
  );
  const filters = useSelector(selectFilters);
  const path = useUrlSearchParams(filters) + `&search=${searchQuery}`;

  //numbers of page
  const count = Math.ceil(total / limit) || 1;

  //change page
  const handleChangePage = (page) => {
    dispatch(changeFilters({ page }));
  };

  // fetch products
  useEffect(() => {
    dispatch(fetchProducts(path));
  }, [dispatch, path]);

  useMemo(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  //check loading
  if (statusProducts === "loading") {
    return (
      <>
        <LinearProgress />
        <Navbar />
      </>
    );
  }

  return (
    <>
      <MetaData title="Search" />
      <Navbar />

      <div className="container-cus wrapper pb-8 pt-4">
        {/* <SideBarFilter /> */}
        <h1 className="mb-4">Kết quả tìm kiếm: {searchQuery}</h1>
        <ListProducts products={products} />
        {count !== 1 && (
          <div className="mt-4 bg-white rounded p-4 flex justify-end">
            <Pagination
              count={count}
              page={1}
              variant="outlined"
              shape="rounded"
              onChange={(_, page) => handleChangePage(page)}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default SearchProduct;
