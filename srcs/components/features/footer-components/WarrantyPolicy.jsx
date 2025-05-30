import React from "react";

const WarrantyPolicy = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-sans">
      <h1 className="text-2xl font-bold mb-6">
        Chính sách bảo hành cho khách hàng GEARVN
      </h1>

      <div className="flex gap-4 mb-6">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Tra cứu phiếu bảo hành
        </button>
        <button className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
          Tra cứu IMEI
        </button>
      </div>

      <p className="mb-4">
        Quý khách vui lòng nhập cả 2 trường thông tin (bắt buộc) để tra cứu
        trạng thái của phiếu bảo hành.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-2 font-medium">Số điện thoại</label>
            <input
              type="tel"
              className="w-full p-2 border rounded-md"
              placeholder="Nhập số điện thoại"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Mã phiếu bảo hành</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              placeholder="Nhập mã phiếu bảo hành"
            />
          </div>
        </div>
        <button className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700">
          Tra cứu
        </button>
      </div>
    </div>
  );
};

export default WarrantyPolicy;
