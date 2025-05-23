import { useState, useEffect } from "react";
import { useUser } from "./UserContext";
import { supabase } from "@/components/services/supabase";
import { FaUser, FaVenusMars, FaPhoneAlt, FaCalendarDay, FaEnvelope } from "react-icons/fa";
import { motion } from "framer-motion";

function FormField({ icon, label, required, children }) {
  return (
    <div className="mb-5">
      <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
        <span className="text-red-500">{icon}</span>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

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
  const [messageType, setMessageType] = useState(""); // "success" or "error"

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
      setMessageType("error");
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
      setMessageType("error");
    } else {
      setMessage("Thông tin tài khoản đã được cập nhật thành công!");
      setMessageType("success");
      setUserInfo((prev) => ({
        ...prev,
        ...form,
      }));
    }
    setLoading(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg mt-10 border border-gray-100"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-700">
          Cập nhật thông tin tài khoản
        </h2>
        <p className="text-gray-500">Điền thông tin cá nhân của bạn bên dưới</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <FormField icon={<FaUser />} label="Họ tên" required>
          <input
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            placeholder="Nhập họ tên của bạn"
            required
          />
        </FormField>

        <FormField icon={<FaVenusMars />} label="Giới tính" required>
          <div className="grid grid-cols-3 gap-3">
            {["Nam", "Nữ", "Khác"].map((gender) => (
              <label 
                key={gender} 
                className={`flex items-center justify-center px-4 py-3 border rounded-lg cursor-pointer transition-all ${
                  form.gender === gender 
                    ? 'bg-red-50 border-red-500 text-red-600 font-medium shadow-sm' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="gender"
                  value={gender}
                  checked={form.gender === gender}
                  onChange={handleChange}
                  className="hidden"
                />
                <span>{gender}</span>
              </label>
            ))}
          </div>
        </FormField>

        <FormField icon={<FaPhoneAlt />} label="Số điện thoại" required>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            placeholder="Nhập số điện thoại của bạn"
            required
          />
        </FormField>

        <FormField icon={<FaEnvelope />} label="Email">
          <input
            type="email"
            value={userInfo?.email || ""}
            disabled
            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 mt-1">Email không thể thay đổi</p>
        </FormField>

        <FormField icon={<FaCalendarDay />} label="Ngày sinh">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <input
                type="number"
                name="day"
                value={form.dob.day}
                onChange={handleChange}
                placeholder="Ngày"
                min="1"
                max="31"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <input
                type="number"
                name="month"
                value={form.dob.month}
                onChange={handleChange}
                placeholder="Tháng"
                min="1"
                max="12"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <input
                type="number"
                name="year"
                value={form.dob.year}
                onChange={handleChange}
                placeholder="Năm"
                min="1900"
                max={new Date().getFullYear()}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </FormField>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg ${
              messageType === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message}
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full py-3.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-lg font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang cập nhật...
            </span>
          ) : (
            "Lưu thông tin"
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}

export default FormAccount;
