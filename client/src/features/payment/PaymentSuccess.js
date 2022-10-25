import React from "react";
import { useNavigate } from "react-router-dom";

import MetaData from "../../components/Layout/MetaData";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <>
      <MetaData title="Thanh toán thành công" />
      <div className="h-screen flex flex-col justify-center items-center px-4">
        <div className="bg-white shadow rounded p-8 flex flex-col justify-center items-center gap-8 w-[400px] max-w-[100%] text-center">
          <div className="bg-green-500 w-[60px] h-[60px] rounded-full flex justify-center items-center">
            <CheckRoundedIcon className="!text-white !w-[30px] !h-[30px]" />
          </div>
          <h1 className="font-bold text-base md:text-lg text-green-500">
            Bạn đã thanh toán thành công
          </h1>
          <button className="btn btn--pink" onClick={() => navigate("/")}>
            Trở về trang chủ
          </button>
        </div>
      </div>
    </>
  );
};

export default PaymentSuccess;
