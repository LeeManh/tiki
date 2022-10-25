import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import MetaData from "../../components/Layout/MetaData";
import { selectUser, updateUser } from "../auth/authSlice";
import { userApi } from "../../api/userApi";
import CreateIcon from "@mui/icons-material/Create";
import PhoneIcon from "@mui/icons-material/Phone";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockIcon from "@mui/icons-material/Lock";

const EditProfile = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const [data, setData] = useState({
    name: user.name || "",
    avatar: user.avatar.url || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputAvatarRef = useRef();

  const canSubmit = Boolean(data.name);

  const handleChangeData = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleChangeAvatar = (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setData({
          ...data,
          avatar: reader.result,
        });
      }
    };
    e.target.files[0] && reader.readAsDataURL(e.target.files[0]);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);
    const toastId = toast.loading("Loading...");

    try {
      const response = await userApi.updateProfile(data);
      const { name, avatar } = response.data.user;

      toast.success("Update success");
      dispatch(updateUser({ name, avatar }));
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
      toast.dismiss(toastId);
    }
  };

  return (
    <>
      <MetaData title="Thông tin cá nhân" />

      <div className="min-h-screen">
        {error && (
          <span className="text-error first-letter:uppercase">{error}</span>
        )}
        <form
          className="grid grid-cols-1 md:grid-cols-2 md:divide-x"
          onSubmit={handleUpdateProfile}
        >
          {/* Left */}
          <div className="p-4">
            <h2 className="text-secondary font-medium mb-8 text-center md:text-left">
              Thông tin cá nhân
            </h2>

            {/* avatar */}
            <div
              className="flex justify-center md:justify-start"
              onClick={() => inputAvatarRef.current.click()}
            >
              <div className="relative cursor-pointer">
                <div className="flex w-[100px] h-[100px] md:w-[120px] md:h-[120px] rounded-full overflow-hidden  border-4 border-blue-300">
                  <img
                    src={data.avatar}
                    alt="avatar"
                    className="w-full h-full object-cover shrink-0"
                  />
                </div>

                <div className="bg-gray-400 rounded-full inline-flex items-center justify-center p-[3px] absolute bottom-1 right-3">
                  <CreateIcon className="!w-3 !h-3" />
                </div>
                <input
                  type="file"
                  className="absolute inset-0 w-[1px] h-[1px]"
                  ref={inputAvatarRef}
                  onChange={handleChangeAvatar}
                />
              </div>
            </div>

            {/* Name */}
            <div className="flex gap-2 mt-4 flex-col">
              <span className="text-sm font-medium whitespace-nowrap w-[100px]">
                Họ và tên
              </span>
              <input
                type="text"
                placeholder="Thêm họ tên"
                className="outline-none border border-gray-400 px-3 py-1 rounded bg-white w-full"
                name="name"
                value={data.name}
                onChange={handleChangeData}
              />
            </div>
          </div>

          {/* Right */}
          <div className="p-4">
            <h2 className="text-secondary font-medium mb-8">
              Số điện thoại và email
            </h2>
            <div className="space-y-4">
              <div className="flex gap-x-4 gap-y-2 items-center justify-between flex-wrap">
                <div className="flex items-center gap-x-4">
                  <PhoneIcon className="text-secondary" />

                  <div>
                    <span className="text-sm font-medium block">
                      Số điện thoại
                    </span>
                    <span className="text-sm">
                      {user?.phone ? user.phone : "Chưa có"}
                    </span>
                  </div>
                </div>

                <Link className="btn-update" to="phone">
                  Cập nhật
                </Link>
              </div>

              <div className="flex gap-x-4 gap-y-2 items-center justify-between flex-wrap">
                <div className="flex items-center gap-x-4">
                  <MailOutlineIcon className="text-secondary" />

                  <div>
                    <span className="text-sm font-medium block">
                      Địa chỉ email
                    </span>
                    <span className="text-sm">{user?.email}</span>
                  </div>
                </div>
                <Link className="btn-update" to="email">
                  Cập nhật
                </Link>
              </div>
            </div>

            <h2 className="text-secondary font-medium mb-8 mt-8">Bảo mật</h2>
            <div className="flex gap-x-4 gap-y-2 items-center justify-between flex-wrap">
              <div className="flex items-center gap-x-4">
                <LockIcon className="text-secondary" />

                <span className="text-sm font-medium block">
                  Thiết lập mật khẩu
                </span>
              </div>
              <Link className="btn-update" to="password">
                Cập nhật
              </Link>
            </div>
          </div>

          {/* Button */}
          <div className="px-4">
            <button
              className={`mt-4 px-4 py-2 text-white text-sm font-medium rounded ${
                loading || !canSubmit ? "bg-gray-400" : "bg-primary"
              }`}
              type="submit"
              disabled={loading || !canSubmit}
            >
              {loading ? "Loading..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditProfile;
