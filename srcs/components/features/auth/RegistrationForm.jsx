import { useState } from "react";
import { useForm } from "react-hook-form";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/outline";

function RegistrationForm() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const onSubmit = (data) => {
    console.log(data); // Xử lý dữ liệu khi form submit
    // Gọi API đăng ký ở đây
  };

  return (
    <form 
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-[400px] flex flex-col gap-4"
    >
      {/* Trường Họ và Tên */}
      <div>
        <input
          type="text"
          placeholder="Họ và Tên"
          className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 ${
            errors.fullName ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
          }`}
          {...register("fullName", { required: "Vui lòng nhập họ và tên" })}
        />
        {errors.fullName && (
          <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
        )}
      </div>

      {/* Trường Email */}
      <div>
        <input
          type="email"
          placeholder="Email"
          className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 ${
            errors.email ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
          }`}
          {...register("email", { 
            required: "Vui lòng nhập email",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Email không hợp lệ"
            }
          })}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Trường Mật khẩu */}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Mật khẩu"
          className={`w-full px-4 py-3 border rounded-lg pr-12 ${
            errors.password ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
          }`}
          {...register("password", { 
            required: "Vui lòng nhập mật khẩu",
            minLength: {
              value: 6,
              message: "Mật khẩu phải có ít nhất 6 ký tự"
            }
          })}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          {showPassword ? (
            <EyeOffIcon className="w-5 h-5 text-gray-500" />
          ) : (
            <EyeIcon className="w-5 h-5 text-gray-500" />
          )}
        </button>
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      {/* Trường Xác nhận mật khẩu */}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Xác nhận mật khẩu"
          className={`w-full px-4 py-3 border rounded-lg pr-12 ${
            errors.confirmPassword ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
          }`}
          {...register("confirmPassword", { 
            required: "Vui lòng xác nhận mật khẩu",
            validate: (value) => 
              value === watch("password") || "Mật khẩu không khớp"
          })}
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        Đăng ký
      </button>
    </form>
  );
}

export default RegistrationForm;