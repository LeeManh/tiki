import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useConfirm } from "material-ui-confirm";

import CircularProgress from "@mui/material/CircularProgress";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import TagIcon from "@mui/icons-material/Tag";
import InfoIcon from "@mui/icons-material/Info";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import numberWithCommas from "../../../utils/numberWithCommas";
import Divider from "@mui/material/Divider";
import SendIcon from "@mui/icons-material/Send";
import { orderApi } from "../../../api/orderApi";

const EditOrder = () => {
  const { id } = useParams();
  const confirm = useConfirm();

  const [order, setOrder] = useState();
  const [loadingFetchOrder, setLoadingFetchOrder] = useState(true);
  const [status, setStatus] = useState();

  const handleClickDelivery = () => {
    confirm({
      title: "Xác nhận giao hàng",
      description: `Bạn có giao đơn hàng này không ?`,
    })
      .then(() => {
        changeStatusOrder();
      })
      .catch(() => {});
  };

  const changeStatusOrder = async () => {
    const idToast = toast.loading("Loading...");
    try {
      await orderApi.changeOrderStatus(id);
      setStatus("Delivered");
      toast.success("Cập nhật thành công");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      toast.dismiss(idToast);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await orderApi.getDetailsOrder(id);
        setOrder(res.data.order);
        setStatus(res.data.order.orderStatus);
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingFetchOrder(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loadingFetchOrder) {
    return (
      <div className="flex justify-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="container-cus wrapper">
      <div className="bg-white my-4 p-4 flex items-center justify-between flex-wrap gap-y-4">
        <h1 className="text-lg font-semibold">Chi tiết đơn hàng</h1>
        <button
          className={`disabled:cursor-default text-xs flex font-semibold md:text-sm items-center gap-x-1  rounded px-3 py-1 md:px-4 md:py-2 text-white ${
            status === "Delivered" ? "bg-gray-400" : "bg-green-400"
          }`}
          disabled={status === "Delivered"}
          onClick={handleClickDelivery}
        >
          <SendIcon />
          <span>Giao hàng</span>
        </button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="bg-white p-4 w-full md:w-1/2 rounded shadow">
          <h3 className="font-semibold text-base md:text-lg mb-2">
            Thông tin giao hàng
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-x-2">
              <PersonIcon className="text-secondary" />

              <div className="text-sm">
                <span className="font-semibold">Tên người nhận : </span>
                <span className="text-sm">{order.shippingInfo.name}</span>
              </div>
            </div>
            <div className="flex items-center gap-x-2">
              <PhoneIcon className="text-secondary" />

              <div className="text-sm">
                <span className="font-semibold">Số điện thoại : </span>
                <span className="text-sm">{order.shippingInfo.phone}</span>
              </div>
            </div>
            <div className="flex items-center gap-x-2">
              <FmdGoodIcon className="text-secondary" />

              <div className="text-sm">
                <span className="font-semibold">Địa chỉ : </span>
                <span className="text-sm">{order.shippingInfo.address}</span>
              </div>
            </div>
            <div className="flex items-center gap-x-2">
              <InfoIcon className="text-secondary" />

              <div className="text-sm">
                <span className="font-semibold">Trạng thái : </span>
                <span
                  className={`text-sm font-semibold ${
                    status === "Processing" ? "text-pink" : "text-green-500"
                  }`}
                >
                  {status === "Processing" ? "Đang xử lý ..." : "Đã giao hàng"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 w-full md:w-1/2 rounded shadow">
          <h3 className="font-semibold text-base md:text-lg mb-2">
            Thông tin thanh toán
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-x-2">
              <TagIcon className="text-secondary" />
              <div className="text-sm">
                <span className="font-semibold">ID : </span>
                <span className="text-sm">{order.paymentInfo.id}</span>
              </div>
            </div>

            <div className="flex items-center gap-x-2">
              <CalendarTodayIcon className="text-secondary" />
              <div className="text-sm">
                <span className="font-semibold">Thời gian : </span>
                <span className="text-sm">{order.paidAt}</span>
              </div>
            </div>

            <div className="flex items-center gap-x-2">
              <AttachMoneyIcon className="text-secondary" />
              <div className="text-sm">
                <span className="font-semibold">Tổng cộng : </span>
                <span className="text-sm font-semibold text-pink">
                  {numberWithCommas(order.totalPrice)} đ
                </span>
              </div>
            </div>

            <div className="flex items-center gap-x-2">
              <InfoIcon className="text-secondary" />
              <div className="text-sm">
                <span className="font-semibold">Trạng thái : </span>
                <span className="text-green-500 font-semibold">
                  {order.paymentInfo.status
                    ? "Đã thanh toán"
                    : "Chưa thanh toán"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 w-full my-4 rounded shadow">
        <h3 className="font-semibold text-base md:text-lg mb-2">
          Chi tiết sản phẩm
        </h3>

        {order.orderItems.map((item, index) => (
          <React.Fragment key={item._id}>
            <div className="text-sm lg:text-base space-y-2">
              <div className="line-clamp-4">
                <span className="font-semibold">Tên sản phẩm : </span>
                <span>{item.name}</span>
              </div>
              <div>
                <span className="font-semibold">Giá : </span>
                <span className="font-semibold text-pink">
                  {numberWithCommas(item.price)} đ
                </span>
              </div>
              <div>
                <span className="font-semibold">Khuyến mãi (%) : </span>
                <span>{item.sales}</span>
              </div>
              <div>
                <span className="font-semibold">Số lượng : </span>
                <span>{item.quantity}</span>
              </div>
              <div>
                <span className="font-semibold mb-2 block">Hình ảnh : </span>
                <div className="flex flex-wrap gap-4">
                  {item.images.map((image) => (
                    <img
                      key={image._id}
                      src={image.url}
                      alt=""
                      className="w-[80px] h-[80px] rounded object-cover border border-gray-300"
                    />
                  ))}
                </div>
              </div>
            </div>

            {index !== order.orderItems.length - 1 && (
              <Divider className="!my-4" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default EditOrder;
