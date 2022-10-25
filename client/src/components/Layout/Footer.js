import React from "react";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import TwitterIcon from "@mui/icons-material/Twitter";

const Footer = () => {
  return (
    <div className="container-cus wrapper">
      <div className=" bg-white shadow rounded grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4 py-8">
        <div>
          <h4 className="footer-item-header">Hỗ trợ khách hàng</h4>
          <div className="space-y-1">
            <p className="footer-item-link">
              Hotline :
              <span className="font-semibold text-black"> 1900-6035</span> (1000
              đ/phút, 8-21h kể cả T7, CN)
            </p>
            <p className="footer-item-link">Các câu hỏi thường gặp</p>
            <p className="footer-item-link">Gửi yêu cầu hỗ trợ</p>
            <p className="footer-item-link">Hướng dẫn đặt hàng</p>
            <p className="footer-item-link">Phương thức vận chuyển</p>
            <p className="footer-item-link">Chính sách đổi trả</p>
            <p className="footer-item-link">Hướng dẫn trả góp</p>
          </div>
        </div>

        <div>
          <h4 className="footer-item-header">Về Tiki</h4>
          <div className="space-y-1">
            <p className="footer-item-link">Giới thiệu Tiki</p>
            <p className="footer-item-link">Tuyển dụng</p>
            <p className="footer-item-link">Chính sách bảo mật thanh toán</p>
            <p className="footer-item-link">
              Chính sách bảo mật thông tin cá nhân
            </p>
            <p className="footer-item-link">Chính sách giải quyết khiếu nại</p>
            <p className="footer-item-link">Điều khoản sử dụng</p>
            <p className="footer-item-link">Giới thiệu Tiki Xu</p>
          </div>
        </div>

        <div>
          <div className="mb-4">
            <h4 className="footer-item-header">Hợp tác và liên kết</h4>
            <div className="space-y-1">
              <p className="footer-item-link">Quy chế hoạt động Sàn GDTMĐT </p>
              <p className="footer-item-link">Bán hàng cùng Tiki</p>
            </div>
          </div>
          <div>
            <h4 className="footer-item-header">Chứng nhận bởi</h4>
            <div className="flex items-center gap-2">
              <img
                src="https://frontend.tikicdn.com/_desktop-next/static/img/footer/bo-cong-thuong-2.png"
                alt=""
                className="w-[48px] h-[48px] "
              />
              <img
                src="https://frontend.tikicdn.com/_desktop-next/static/img/footer/bo-cong-thuong.svg"
                alt=""
                className="h-[48px]"
              />
            </div>
          </div>
        </div>

        <div>
          <div className="mb-4">
            <h4 className="footer-item-header">Kết nối với chúng tôi</h4>
            <div className="flex items-center gap-2">
              <FacebookIcon className="text-blue-500 !w-8 !h-8 cursor-pointer" />
              <YouTubeIcon className="text-red-500 !w-8 !h-8 cursor-pointer" />
              <TwitterIcon className="text-blue-500 !w-8 !h-8 cursor-pointer" />
            </div>
          </div>

          <div>
            <h4 className="footer-item-header">Tải ứng dụng trên điện thoại</h4>
            <div className="flex  gap-2">
              <img
                src="https://frontend.tikicdn.com/_desktop-next/static/img/footer/qrcode.png"
                alt=""
                className="w-[80px] h-[80px] cursor-pointer"
              />
              <div className="flex flex-col justify-between">
                <img
                  src="https://frontend.tikicdn.com/_desktop-next/static/img/icons/appstore.png"
                  alt=""
                  className="h-[36px] cursor-pointer"
                />
                <img
                  src="https://frontend.tikicdn.com/_desktop-next/static/img/icons/playstore.png"
                  alt=""
                  className="h-[36px] cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
