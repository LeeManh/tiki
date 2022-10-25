import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { cartApi } from "../../api/cartApi";
import InputQuantity from "../../components/Form/InputQuantity";
import limitNumber from "../../utils/limitNumber";

import numberWithCommas from "../../utils/numberWithCommas";
import {
  changeQuantity,
  removeItemFromSelectedItems,
  removeSingleItem,
  selectItemToSelectedItems,
  selectSelectedItems,
} from "./cartSlice";

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  const selectedItems = useSelector(selectSelectedItems);

  const price = useMemo(() => {
    return item.sales
      ? item.price - (item.sales / 100) * item.price
      : item.price;
  }, [item?.price, item?.sales]);

  const [quantity, setQuantity] = useState(item.quantity);
  const isSelected = selectedItems.some(
    (selectedItem) => selectedItem.productId === item.productId
  );

  const handleChangeQuantity = async ({ math }) => {
    let _quantity = quantity;

    if (math === "plus") {
      _quantity = _quantity === 99 ? _quantity : _quantity + 1;
    } else if (math === "minus") {
      _quantity = _quantity === 1 ? _quantity : _quantity - 1;
    }

    try {
      await cartApi.changeQuantityItemCart({
        cartId: item.cartId,
        quantity: _quantity,
      });

      dispatch(changeQuantity({ id: item.productId, quantity: _quantity }));

      setQuantity(limitNumber(_quantity, 1, 99));
    } catch (error) {
      console.log(error);
    }
  };

  const handleCheck = () => {
    if (isSelected) {
      dispatch(removeItemFromSelectedItems({ _id: item.productId }));
    } else {
      dispatch(selectItemToSelectedItems({ _id: item.productId }));
    }
  };

  const handleDeleteItem = async () => {
    try {
      await cartApi.deleteItemCart({ cartId: item.cartId });
      dispatch(removeSingleItem({ id: item.productId }));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex gap-4 items-center py-2">
      <input
        type="checkbox"
        checked={isSelected}
        onChange={handleCheck}
        className="cursor-pointer"
      />
      <Link to={`/product/${item.productId}`} className="flex-shrink-0 ">
        <img
          src={item.images[0].url}
          alt={item.name}
          className="w-[80px] h-[80px] object-cover rounded cursor-pointer "
        />
      </Link>

      <div className="space-y-2 ">
        <p className="text-sm lg:text-base">{item.name}</p>
        <div className="flex items-center space-x-4">
          <p className="text-pink font-semibold text-lg">
            {numberWithCommas(price)} đ
          </p>
          {item.sales !== 0 && (
            <>
              <p className="text-sm text-secondary line-through font-semibold">
                {numberWithCommas(item.price)} đ
              </p>
              <span className="text-pink p-[2px] border border-pink text-sm leading-none font-semibold">
                -{item.sales}%
              </span>
            </>
          )}
        </div>

        <div className="flex items-center justify-between">
          <InputQuantity
            quantity={quantity}
            onClick={handleChangeQuantity}
            id={item._id}
          />
          <p
            className="text-sm text-blue-500 cursor-pointer font-semibold"
            onClick={handleDeleteItem}
          >
            Xóa
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
