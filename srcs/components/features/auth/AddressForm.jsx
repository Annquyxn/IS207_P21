import { useState } from "react";

function AddressForm() {
  const [gender, setGender] = useState("male");
  const [shippingMethod, setShippingMethod] = useState("standard");

  return (
    <div className="flex flex-col gap-5">
      {/* Họ tên và SĐT */}
      <div className="flex flex-col md:flex-row gap-5">
        <input
          type="text"
          placeholder="Họ và Tên"
          className="flex-1 min-h-[45px] border border-black bg-white px-3 py-2"
        />
        <input
          type="tel"
          placeholder="Số điện thoại liên lạc"
          className="flex-1 min-h-[45px] border border-black bg-white px-3 py-2"
        />
      </div>

      {/* Giới tính */}
      <div className="flex gap-5">
        <label className="flex items-center gap-2 cursor-pointer">
          <div
            className={`w-4 h-4 rounded-full border border-black flex items-center justify-center ${
              gender === "male" ? "bg-black" : "bg-white"
            }`}
          >
            {gender === "male" && (
              <div className="w-3 h-3 rounded-full bg-white"></div>
            )}
          </div>
          <span>Anh</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <div
            className={`w-4 h-4 rounded-full border border-black flex items-center justify-center ${
              gender === "female" ? "bg-black" : "bg-white"
            }`}
          >
            {gender === "female" && (
              <div className="w-3 h-3 rounded-full bg-white"></div>
            )}
          </div>
          <span>Chị</span>
        </label>
      </div>

      {/* Địa chỉ giao hàng */}
      <h3 className="text-xl font-bold">Địa chỉ giao hàng</h3>

      <div className="flex flex-col md:flex-row gap-5">
        <div className="flex-1 min-w-[240px]">
          <div className="flex justify-between items-center p-3 border border-black bg-white">
            <span>Chọn tỉnh/thành phố</span>
            <ChevronDownIcon className="w-5 h-5" />
          </div>
        </div>
        <div className="flex-1 min-w-[240px]">
          <div className="flex justify-between items-center p-3 border border-black bg-white">
            <span>Chọn quận/huyện</span>
            <ChevronDownIcon className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-5">
        <div className="flex-1 min-w-[240px]">
          <div className="flex justify-between items-center p-3 border border-black bg-white">
            <span>Chọn xã/thị trấn</span>
            <ChevronDownIcon className="w-5 h-5" />
          </div>
        </div>
        <input
          type="text"
          placeholder="Số nhà, tên đường"
          className="flex-1 min-h-[45px] border border-black bg-white px-3 py-2"
        />
      </div>

      {/* Ghi chú */}
      <input
        type="text"
        placeholder="Ghi chú thêm"
        className="min-h-[45px] border border-red-600 bg-white px-3 py-2 text-red-600"
      />

      {/* Dịch vụ giao hàng */}
      <h3 className="text-xl font-bold">Dịch vụ giao hàng</h3>

      <div className="flex flex-wrap items-center gap-5">
        <label className="flex items-center gap-2 cursor-pointer">
          <div
            className={`w-4 h-4 rounded-full border border-black flex items-center justify-center ${
              shippingMethod === "standard" ? "bg-black" : "bg-white"
            }`}
          >
            {shippingMethod === "standard" && (
              <div className="w-3 h-3 rounded-full bg-white"></div>
            )}
          </div>
          <span>Giao hàng tiết kiệm</span>
        </label>
        <span className="text-red-600">Dự kiến nhận hàng trong 2-3 ngày</span>
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <div
          className={`w-4 h-4 rounded-full border border-black flex items-center justify-center ${
            shippingMethod === "express" ? "bg-black" : "bg-white"
          }`}
        >
          {shippingMethod === "express" && (
            <div className="w-3 h-3 rounded-full bg-white"></div>
          )}
        </div>
        <span>Giao hàng nhanh</span>
      </label>
    </div>
  );
}

export default AddressForm;
