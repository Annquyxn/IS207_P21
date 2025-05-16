import React from "react";
import { Link, useNavigate } from "react-router-dom";
import AnimatedPage from "@/components/ui/AnimatedPage";
function ForgotPasswordForm({
  register,
  errors,
  onSubmit,
  isLoading,
  showBack,
}) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/login");
  };

  return (
    <AnimatedPage>
      <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg font-sans mt-12 mb-12">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">
          Quên mật khẩu
        </h2>

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="w-full px-4 py-3 border rounded-lg text-lg focus:ring-2 focus:ring-red-500 transition"
              {...register("email", {
                required: "Vui lòng nhập email",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Email không hợp lệ",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-transform transform hover:scale-105"
          >
            {isLoading ? "Đang gửi..." : "Gửi liên kết khôi phục"}
          </button>
        </form>

        {showBack && (
          <button
            onClick={handleBack}
            className="mt-6 w-full py-3 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Quay lại
          </button>
        )}

        <div className="mt-8 text-center text-gray-600 font-semibold">
          <p>
            Đã có tài khoản?{" "}
            <Link to="/login" className="text-red-600 hover:underline">
              Đăng nhập lại
            </Link>
          </p>

          <p className="my-4 text-gray-500">Hoặc đăng nhập bằng</p>

          <div className="flex flex-col items-center gap-4">
            <button
              type="button"
              className="flex items-center justify-center gap-3 px-8 py-3 w-full max-w-md border rounded-lg hover:bg-gray-100 transition-transform transform hover:scale-105"
            >
              <img
                src="/public/google.svg"
                alt="Google"
                className="w-6 h-6"
                draggable={false}
              />
              Google
            </button>

            <button
              type="button"
              className="flex items-center justify-center gap-3 px-8 py-3 w-full max-w-md bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
            >
              <img
                src="/public/facebook.svg"
                alt="Facebook"
                className="w-6 h-6"
                draggable={false}
              />
              Facebook
            </button>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}

export default ForgotPasswordForm;
