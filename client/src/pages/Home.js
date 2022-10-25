import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import LinearProgress from "@mui/material/LinearProgress";
import MetaData from "../components/Layout/MetaData";
import Navbar from "../components/Layout/Navbar";
import ListProducts from "../features/product/ListProducts";
import {
  fetchProducts,
  selectProducts,
  selectProductsPerPage,
  selectStatusProducts,
  selectTotalProducts,
} from "../features/product/productsSlice";
import Pagination from "@mui/material/Pagination";
import { createStructuredSelector } from "reselect";
import {
  changeFilters,
  clearFilters,
  selectFilters,
} from "../features/filters/filtersSlice";
import useUrlSearchParams from "../hooks/useUrlSearchParams";
import FilterDesktop from "../features/filters/FilterDesktop";
import StarIcon from "@mui/icons-material/Star";
import FilterMobile from "../features/filters/FilterMobile";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import Divider from "@mui/material/Divider";
import Banner from "../components/Banner";
import Footer from "../components/Layout/Footer";

const listFilters = {
  category: {
    title: "Danh mục",
    name: "category",
    childs: [
      { text: "Sách Tiếng Anh", value: "category=english-book" },
      { text: "Sách Tiếng Việt", value: "category=vietnamese-book" },
      { text: "Văn phòng phẩm", value: "category=stationery" },
      { text: "Quà lưu niệm", value: "category=souvenir" },
    ],
  },
  ratings: {
    title: "Đánh Giá",
    name: "ratings",
    icons: <StarIcon className="text-yellow-400 !w-5 !h-5" />,
    childs: [
      { text: "Từ 5 sao", value: "ratings[gte]=5" },
      { text: "Từ 4 sao", value: "ratings[gte]=4" },
      { text: "Từ 3 sao", value: "ratings[gte]=3" },
    ],
  },
  price: {
    title: "Giá",
    name: "price",
    childs: [
      { text: "Dưới 50.000", value: "price[lte]=50000" },
      {
        text: "50.000 -> 100.000",
        value: "price[gte]=50000&price[lte]=100000",
      },
      {
        text: "100.000 -> 200.000",
        value: "price[gte]=100000&price[lte]=200000",
      },
      { text: "Trên 200.000", value: "price[gte]=200000" },
    ],
  },
  seller: {
    title: "Công ty phát hành",
    name: "seller",
    childs: [
      { text: "Abc Books", value: "seller=abc-books" },
      { text: "Infor Books", value: "seller=infor-books" },
      { text: "Nhã Nam", value: "seller=nha-nam" },
      { text: "Amazon", value: "seller=amazon" },
    ],
  },
};

const Home = () => {
  const dispatch = useDispatch();

  const { products, statusProducts, total, limit } = useSelector(
    createStructuredSelector({
      products: selectProducts,
      statusProducts: selectStatusProducts,
      total: selectTotalProducts,
      limit: selectProductsPerPage,
    })
  );
  const filters = useSelector(selectFilters);
  const path = useUrlSearchParams(filters);
  const [isOpenFilter, setIsOpenFilter] = useState(false);

  //numbers of page
  const count = Math.ceil(total / limit) || 1;

  //change page
  const handleChangePage = (page) => {
    dispatch(changeFilters({ page }));
  };

  const handleChangeSort = (e) => {
    dispatch(changeFilters({ sort: e.target.value, page: 1 }));
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
      <MetaData title="Trang chủ" />
      <Navbar />

      <div className="container-cus wrapper py-8">
        <div className="flex gap-4">
          <FilterDesktop listFilters={listFilters} />
          <FilterMobile
            isOpen={isOpenFilter}
            setIsOpen={setIsOpenFilter}
            listFilters={listFilters}
          />

          <div className="">
            {/* Banner */}
            <div className="mb-4">
              <Banner />
            </div>

            <div className="w-full">
              {/* Header */}

              <div className="flex items-center gap-x-4 justify-between md:justify-end">
                <div
                  className="flex items-center cursor-pointer md:hidden"
                  onClick={() => setIsOpenFilter(true)}
                >
                  <FilterAltOutlinedIcon className="text-blue-500" />
                  <span className="text-sm text-blue-500 font-semibold">
                    Lọc
                  </span>
                </div>

                <select
                  className="px-3 py-1 border text-sm outline-none "
                  onChange={handleChangeSort}
                  value={filters.sort}
                >
                  <option value="">Sắp xếp</option>
                  <option value="sort=-priceFinal">Giá giảm dần</option>
                  <option value="sort=priceFinal">Giá tăng dần</option>
                  <option value="sort=-createdAt">Mới nhất</option>
                  <option value="sort=createdAt">Cũ nhất</option>
                </select>
              </div>

              <Divider className="!my-4" />
            </div>

            <ListProducts products={products} />

            {count !== 1 && (
              <div className="mt-4 p-4 flex justify-end">
                <Pagination
                  count={count}
                  page={filters.page}
                  variant="outlined"
                  shape="rounded"
                  onChange={(_, page) => handleChangePage(page)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Home;
