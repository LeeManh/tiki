import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";

import { productApi } from "../../../api/productApi";
import ButtonLoading from "../../../components/Button/ButtonLoading";

const schema = yup
  .object({
    name: yup.string().required("Cần nhập tên sản phẩm"),
    desription: yup.string().required("Cần nhập mô tả sản phẩm"),
    price: yup.string().required("Cần nhập giá sản phẩm"),
    sales: yup.string().required("Cần nhập giảm giá sản phẩm"),
    category: yup.string().required("Cần lựa chọn danh mục sản phẩm"),
    seller: yup.string().required("Cần lựa chọn công ty phát hành"),
    images: yup.mixed().test("required", "File is required", (value) => {
      return value?.length;
    }),
  })
  .required();

const CreateProduct = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const cover2base64 = (files) => {
    // conver file list to arr
    const filesArr = Array.from(files);

    filesArr.forEach((file) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        setImages((pre) => [...pre, reader.result]);
      };

      reader.readAsDataURL(file);
    });
  };

  const handleChangeImage = (e) => {
    setImages([]);

    if (e.target.files.length > 0) {
      cover2base64(e.target.files);
    }
  };

  const handleCreateProduct = async (data) => {
    const _data = { ...data, images };

    setLoading(true);
    const toastId = toast.loading("Loading...");

    try {
      const res = await productApi.createProduct(_data);
      toast.success("Thêm mới sản phẩm thành công 🎉.");
      setImages([]);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
      toast.dismiss(toastId);
    }

    reset();
  };

  return (
    <div className="container-cus wrapper">
      <div className="bg-white my-4 p-4">
        <h1 className="text-lg font-semibold">Thêm mới sản phẩm</h1>
      </div>
      <div className="bg-white my-4 p-4">
        <form onSubmit={handleSubmit(handleCreateProduct)}>
          <div className="flex gap-x-8 flex-col gap-y-4 lg:flex-row">
            {/* left */}
            <div className="w-full space-y-4">
              <div className="space-y-2">
                <span className="font-semibold">Tên sản phẩm *</span>
                <input
                  type="text"
                  placeholder="Tên sản phẩm"
                  className="border px-4 py-2 w-full rounded outline-none"
                  {...register("name")}
                />
                <p className="text-error">{errors.name?.message}</p>
              </div>

              <div className="space-y-2">
                <span className="font-semibold">Mô tả *</span>
                <input
                  type="text"
                  placeholder="Mô tả sản phẩm"
                  className="border px-4 py-2 w-full rounded outline-none"
                  {...register("desription")}
                />
                <p className="text-error">{errors.desription?.message}</p>
              </div>

              <div className="space-y-2">
                <span className="font-semibold">Giá *</span>
                <input
                  type="text"
                  placeholder="0.00 vnd"
                  className="border px-4 py-2 w-full rounded outline-none"
                  {...register("price")}
                />
                <p className="text-error">{errors.price?.message}</p>
              </div>

              <div className="space-y-2">
                <span className="font-semibold">Giảm giá (%) *</span>
                <input
                  type="text"
                  placeholder="0 %"
                  maxLength={3}
                  className="border px-4 py-2 w-full rounded outline-none"
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  {...register("sales")}
                />
                <p className="text-error">{errors.sales?.message}</p>
              </div>

              <div className="space-y-2 flex flex-col">
                <span className="font-semibold">Danh mục *</span>
                <select
                  className="w-full outline-none border px-4 py-2 rounded"
                  {...register("category")}
                >
                  <option value="">Lựa chọn danh mục sản phẩm</option>
                  <option value="english-book">Sách tiếng anh</option>
                  <option value="vietnamese-book">Sách tiếng việt</option>
                  <option value="stationery">Văn phòng phẩm</option>
                  <option value="souvenir">Quà lưu niệm</option>
                </select>
                <p className="text-error">{errors.category?.message}</p>
              </div>

              <div className="space-y-2 flex flex-col">
                <span className="font-semibold">Công ty phát hành *</span>
                <select
                  className="w-full outline-none border px-4 py-2 rounded"
                  {...register("seller")}
                >
                  <option value="">Lựa chọn công ty phát hành</option>
                  <option value="abc-books">Abc Book</option>
                  <option value="infor-books">Infor Book</option>
                  <option value="nha-nam">Nhã Nam</option>
                  <option value="amazon">Amazon</option>
                </select>
                <p className="text-error">{errors.category?.message}</p>
              </div>
            </div>

            {/* Right */}
            <div className="w-full">
              <div className="flex flex-col space-y-2">
                <span className="font-semibold">Hình ảnh *</span>

                <input
                  type="file"
                  multiple
                  {...register("images")}
                  onChange={handleChangeImage}
                />
                {/* Preview images */}
                {images.length > 0 ? (
                  <div className="flex gap-4 flex-wrap">
                    {images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt=""
                        className="w-[120px] h-[120px] object-contain rounded"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="w-[300px] h-[200px] border-2 border-dashed border-gray-400 rounded flex items-center justify-center">
                    <span className="font-semibold text-sm text-secondary">
                      Chưa có hình ảnh
                    </span>
                  </div>
                )}
              </div>

              <p className="text-error">{errors.images?.message}</p>
            </div>
          </div>

          <button
            className={`btn btn--pink !mt-8 w-full max-w-[200px] disabled:cursor-default ${
              loading && "bg-gray-400"
            }`}
            disabled={loading}
          >
            {loading ? "Loading..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
