import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import MetaData from "../../components/Layout/MetaData";
import numberWithCommas from "../../utils/numberWithCommas";
import { removeItemFavourite, selectItemsfavourite } from "./favouriteSlice";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from "@mui/material/Tooltip";
import { addItemToCart, selectCartitems } from "../cart/cartSlice";
import { favouriteApi } from "../../api/favouriteApi";
import { cartApi } from "../../api/cartApi";

const Favourite = () => {
  const dispatch = useDispatch();

  const items = useSelector(selectItemsfavourite);
  const cartItems = useSelector(selectCartitems);

  const handleRemoveFavourite = async (product) => {
    try {
      //call api delete
      await favouriteApi.deleteItemFavourite(product.favouriteId);
      //
      dispatch(removeItemFavourite({ id: product.productId }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddItemToCart = async (product) => {
    const isAlreadyHave = cartItems.some(
      (item) => item.productId === product.productId
    );

    if (isAlreadyHave) {
      toast.error("Đã có sản phẩm trong giỏ hàng");
      return;
    }

    try {
      const res = await cartApi.addItemCart({
        product: { ...product, productId: product.productId },
        quantity: 1,
      });

      dispatch(
        addItemToCart({
          ...product,
          quantity: 1,
          cartId: res.data.cart._id,
        })
      );

      await favouriteApi.deleteItemFavourite(product.favouriteId);
      dispatch(removeItemFavourite({ id: product.productId }));

      //nofications
      toast.success("Thêm sản phẩm thành công");
    } catch (error) {
      console.log(error);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex justify-center items-center flex-col gap-4 min-h-[400px]">
        <img
          src="https://frontend.tikicdn.com/_desktop-next/static/img/mascot_fail.svg"
          alt=""
        />
        <p className="text-sm text-center">
          Hãy ❤ sản phẩm bạn yêu thích khi mua sắm để xem lại thuận tiện nhất
        </p>
        <Link className="btn btn--pink" to="/">
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <>
      <MetaData title="Yêu thích" />

      <div className="p-4">
        <h2 className="text-secondary font-medium mb-4">Sản phẩm yêu thích</h2>

        <div className="space-y-4">
          {items.map((item) => (
            <div key={item._id} className="flex gap-2 md:gap-4 items-start">
              <Link to={`/product/${item.productId}`} className="shrink-0">
                <img
                  src={item.images[0].url}
                  alt=""
                  className="w-[60px] h-[60px] md:w-[80px] md:h-[80px] object-cover border rounded"
                />
              </Link>

              <div className="grow">
                <Link to={`/product/${item.productId}`}>
                  <p className="line-clamp-3 font-medium mb-1 text-sm">
                    {item.name}
                  </p>
                </Link>
                <p className="text-sm">{numberWithCommas(item.price)} đ</p>
              </div>

              <div className="flex items-center gap-3 text-secondary flex-col md:flex-row">
                <Tooltip
                  title="Thêm vào giỏ hàng"
                  placement="top"
                  className="cursor-pointer"
                  onClick={() => handleAddItemToCart(item)}
                >
                  <AddIcon />
                </Tooltip>
                <Tooltip
                  title="Xóa khỏi yêu thích"
                  placement="bottom"
                  className="cursor-pointer"
                  onClick={() => handleRemoveFavourite(item)}
                >
                  <DeleteIcon />
                </Tooltip>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Favourite;
