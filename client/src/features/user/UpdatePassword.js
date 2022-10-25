import React, { useState } from "react";
import { userApi } from "../../api/userApi";
import MetaData from "../../components/Layout/MetaData";
import toast from "react-hot-toast";

const UpdatePassword = () => {
  const [data, setData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const canSave = Object.values(data).every(Boolean);

  const handleChangeData = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (!canSave) return;

    const toastId = toast.loading("Loading...");

    try {
      setLoading(true);

      await userApi.updatePassword(data);
      toast.success("Cập nhật mật khẩu thành công");

      setError(null);
      setData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
      toast.dismiss(toastId);
    }
  };

  return (
    <>
      <MetaData title="Update password" />

      <div className="p-4">
        <h2 className="text-center font-medium text-lg mb-4 text-secondary">
          Cập nhật mật khẩu
        </h2>
        {error && <span className="text-error">{error}</span>}
        <form
          className="max-w-[500px] mx-auto space-y-4"
          onSubmit={handleUpdatePassword}
        >
          <div className="space-y-2">
            <label className="block font-medium">Mật khẩu cũ</label>
            <input
              type="password"
              name="oldPassword"
              className="px-2 py-2 rounded border outline-none border-gray-400 text-sm w-full"
              placeholder="Nhập mật khẩu cũ"
              value={data.oldPassword}
              onChange={handleChangeData}
            />
          </div>

          <div className="space-y-2">
            <label className="block font-medium">Mật khẩu mới</label>
            <input
              type="password"
              name="newPassword"
              className="px-2 py-2 rounded border outline-none border-gray-400 text-sm w-full"
              placeholder="Nhập mật khẩu mới"
              value={data.newPassword}
              onChange={handleChangeData}
            />
          </div>

          <div className="space-y-2">
            <label className="block font-medium">Xác nhận mật khẩu mới</label>
            <input
              type="password"
              name="confirmPassword"
              className="px-2 py-2 rounded border outline-none border-gray-400 text-sm w-full"
              placeholder="Nhập xác nhận mật khẩu mới"
              value={data.confirmPassword}
              onChange={handleChangeData}
            />
          </div>

          <button
            className={`btn-form ${!canSave || loading ? "disabled" : ""}`}
            disabled={!canSave || loading}
          >
            {loading ? "Loading..." : "Cập nhật"}
          </button>
        </form>
      </div>
    </>
  );
};

export default UpdatePassword;
