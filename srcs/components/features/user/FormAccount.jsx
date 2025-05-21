import { useState, useEffect } from "react";
import { useUser } from "./UserContext";
import { supabase } from "@/components/services/supabase";

function FormAccount() {
  const { userInfo, setUserInfo } = useUser();
  const [form, setForm] = useState({
    fullName: "",
    gender: "",
    phone: "",
    dob: { day: "", month: "", year: "" },
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (userInfo) {
      setForm({
        fullName: userInfo.fullName || "",
        gender: userInfo.gender || "",
        phone: userInfo.phone || "",
        dob: userInfo.dob || { day: "", month: "", year: "" },
      });
    }
  }, [userInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["day", "month", "year"].includes(name)) {
      setForm((prev) => ({
        ...prev,
        dob: { ...prev.dob, [name]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    // Validate
    if (!form.fullName || !form.phone || !form.gender) {
      setMessage("Vui lòng điền đầy đủ thông tin bắt buộc.");
      setLoading(false);
      return;
    }
    // Cập nhật lên Supabase
    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: form.fullName,
        gender: form.gender,
        phone: form.phone,
        dob: form.dob,
      },
    });
    if (error) {
      setMessage("Cập nhật thất bại: " + error.message);
    } else {
      setMessage("Cập nhật thành công!");
      setUserInfo((prev) => ({
        ...prev,
        ...form,
      }));
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-lg mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
        Cập nhật thông tin tài khoản
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-medium mb-1">Họ tên *</label>
          <input
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Giới tính *</label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          >
            <option value="">Chọn giới tính</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Khác">Khác</option>
          </select>
        </div>
        <div>
          <label className="block font-medium mb-1">Số điện thoại *</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            value={userInfo?.email || ""}
            disabled
            className="w-full px-4 py-2 border rounded-lg bg-gray-100"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Ngày sinh</label>
          <div className="flex gap-2">
            <input
              type="number"
              name="day"
              value={form.dob.day}
              onChange={handleChange}
              placeholder="Ngày"
              min="1"
              max="31"
              className="w-1/3 px-2 py-2 border rounded-lg"
            />
            <input
              type="number"
              name="month"
              value={form.dob.month}
              onChange={handleChange}
              placeholder="Tháng"
              min="1"
              max="12"
              className="w-1/3 px-2 py-2 border rounded-lg"
            />
            <input
              type="number"
              name="year"
              value={form.dob.year}
              onChange={handleChange}
              placeholder="Năm"
              min="1900"
              max={new Date().getFullYear()}
              className="w-1/3 px-2 py-2 border rounded-lg"
            />
          </div>
        </div>
        {message && (
          <div className="text-center text-red-600 font-medium">{message}</div>
        )}
        <button
          type="submit"
          className="w-full py-3 bg-red-600 text-white text-lg font-semibold rounded-lg hover:bg-red-700"
          disabled={loading}
        >
          {loading ? "Đang cập nhật..." : "Lưu thông tin"}
        </button>
      </form>
    </div>
  );
}

export default FormAccount;
