import React from "react";
import CardProduct from "./CardProduct";

const ListProducts = ({ products }) => {
  if (products?.length === 0) {
    return <div className="text-center">Không có sản phẩm phù hợp 🐸 ...</div>;
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {products.map((product) => (
        <CardProduct key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ListProducts;
