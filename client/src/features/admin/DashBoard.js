import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from "recharts";

import LinearProgress from "@mui/material/LinearProgress";
import { orderApi } from "../../api/orderApi";
import { productApi } from "../../api/productApi";
import { userApi } from "../../api/userApi";
import numberWithCommas from "../../utils/numberWithCommas";

const DashBoard = () => {
  const [data, setData] = useState({
    products: 0,
    orders: {},
    users: 0,
    usersStats: [],
  });

  const [loading, setLoading] = useState(true);

  const income = useMemo(() => {
    const total =
      data?.orders?.orders?.reduce((sum, order) => sum + order.totalPrice, 0) ||
      0;

    return numberWithCommas(total);
  }, [JSON.stringify(data.orders)]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchProducts = productApi.getAllProducts();
      const fetchUsers = userApi.getAllUsersAdmin();
      const fetchUsersStats = userApi.getUsersStats();
      const fetchOrders = orderApi.getAllOrdersAdmin();

      Promise.all([fetchProducts, fetchUsers, fetchOrders, fetchUsersStats])
        .then(([resProducts, resUsers, resOrders, resUsersStats]) => {
          setData({
            ...data,
            products: resProducts.data.count,
            orders: resOrders.data,
            users: resUsers.data.count,
            usersStats: resUsersStats.data,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="w-full">
        <LinearProgress />
      </div>
    );
  }

  return (
    <>
      <div className="bg-white my-4 p-4">
        <h1 className="text-lg font-semibold">Dashboard</h1>
      </div>

      {/* features */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <div className="p-4 md:p-6 bg-white rounded shadow">
          <p className="text-secondary text-sm font-semibold uppercase ">
            Sản phẩm
          </p>
          <p className="text-sm md:text-base font-semibold">{data.products}</p>
          <Link
            to="/admin/products"
            className="text-xs font-semibold underline cursor-pointer text-blue-400"
          >
            Xem tất cả sản phẩm
          </Link>
        </div>

        <div className="p-4 md:p-6 bg-white rounded shadow ">
          <p className="text-secondary text-sm font-semibold uppercase ">
            Người dùng
          </p>
          <p className="text-sm md:text-base font-semibold">{data.users}</p>
          <Link
            to="/admin/users"
            className="text-xs font-semibold underline cursor-pointer text-blue-400"
          >
            Xem tất cả người dùng
          </Link>
        </div>

        <div className="p-4 md:p-6 bg-white rounded shadow ">
          <p className="text-secondary text-sm font-semibold uppercase ">
            Đơn hàng
          </p>
          <p className="text-sm md:text-base font-semibold">
            {data.orders.count}
          </p>
          <Link
            to="/admin/orders"
            className="text-xs font-semibold underline cursor-pointer text-blue-400"
          >
            Xem tất cả đơn hàng
          </Link>
        </div>
        <div className="p-4 md:p-6 bg-white rounded shadow ">
          <p className="text-secondary text-sm font-semibold uppercase ">
            Doanh thu
          </p>
          <p className="text-sm md:text-base font-semibold text-pink">
            {income} đ
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="my-4 p-4 bg-white h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={300}
            data={data.usersStats}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id">
              <Label value="Tháng" offset={5} position="insideBottomRight" />
            </XAxis>
            <YAxis name="Số lượng lượng" />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="total"
              name="người dùng"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            {/* <Line type="monotone" dataKey="uv" stroke="#82ca9d" /> */}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default DashBoard;
