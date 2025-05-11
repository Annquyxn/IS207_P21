import { useState } from "react";

function RegistrationForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form className="w-full max-w-[400px] flex flex-col gap-4">
      <input
        type="text"
        placeholder="Họ và Tên"
        className="w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
      />
      
      <div className="relative w-full">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Mật khẩu"
          className="w-full px-4 py-3 border rounded-lg pr-12"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          <EyeIcon className="w-5 h-5 text-gray-500" />
        </button>
      </div>
      
      <button
        type="submit"
        className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        Đăng ký
      </button>
    </form>
  )
}

export default RegistrationForm;