import React from "react";
import MetaData from "../../components/Layout/MetaData";
import OrderTable from "./OrderTable";

const Order = () => {
  return (
    <>
      <MetaData title="Account" />
      <div className="p-4">
        <h2 className="text-secondary font-medium text-center md:text-left">
          Đơn hàng của tôi
        </h2>

        <div>
          <OrderTable />
        </div>
      </div>
    </>
  );
};

export default Order;
