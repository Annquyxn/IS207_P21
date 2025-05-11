import { useState } from "react";

function AddressForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    province: "",
    district: "",
    ward: "",
    address: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-xl font-bold mb-6">Thông tin giao hàng</h2>

      <form className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Họ và tên*
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số điện thoại*
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tỉnh/Thành phố*
            </label>
            <select
              name="province"
              value={formData.province}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500"
              required
            >
              <option value="">Chọn tỉnh/thành</option>
              {/* Options would be populated from API */}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quận/Huyện*
            </label>
            <select
              name="district"
              value={formData.district}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500"
              required
            >
              <option value="">Chọn quận/huyện</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phường/Xã*
            </label>
            <select
              name="ward"
              value={formData.ward}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500"
              required
            >
              <option value="">Chọn phường/xã</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Địa chỉ cụ thể*
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500"
            required
          />
        </div>
      </form>
    </div>
  );
}

export default AddressForm;
