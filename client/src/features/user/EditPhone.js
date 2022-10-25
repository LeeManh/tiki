import React, { useState } from "react";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";

import MetaData from "../../components/Layout/MetaData";
import { userApi } from "../../api/userApi";
import { selectUser, updateUser } from "../auth/authSlice";

const EditPhone = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const [phone, setPhone] = useState(user?.phone || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const canSubmit = Boolean(phone);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);
    const toastId = toast.loading("Loading...");

    try {
      const response = await userApi.updateProfile({ phone });
      toast.success("Update success");

      dispatch(updateUser({ phone: response.data.user.phone }));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      toast.dismiss(toastId);
    }
  };

  return (
    <>
      <MetaData title="Cập nhật số điện thoại" />

      <div className="p-4">
        <h2 className="text-center font-medium text-lg mb-4 text-secondary">
          Cập nhật số điện thoại
        </h2>
        <form className="max-w-[500px] mx-auto" onSubmit={handleUpdateProfile}>
          <div className="space-y-2">
            <label className="block font-medium">Số điện thoại</label>
            <input
              type="text"
              name="phone"
              className="px-2 py-2 rounded border outline-none border-gray-400 text-sm w-full"
              placeholder="Nhập số điện thoại"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
            />
          </div>

          <button
            className={`mt-4 px-4 py-2 text-white text-sm font-medium rounded ${
              loading || !canSubmit ? "bg-gray-400" : "bg-primary"
            }`}
            type="submit"
            disabled={loading || !canSubmit}
          >
            {loading ? "Loading..." : "Lưu thay đổi"}
          </button>
        </form>
      </div>
    </>
  );
};

export default EditPhone;
