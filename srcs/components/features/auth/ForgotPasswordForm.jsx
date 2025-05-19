import { useNavigate } from "react-router-dom";
import AnimatedPage from "@/components/ui/AnimatedPage";
import SocialLogin from "@/components/ui/SocialLogin";
import { useForgotPasswordLogic } from "./useFormForgotPassword";

function ForgotPasswordForm({ onSubmit, isLoading, showBack }) {
  const navigate = useNavigate();
  const { register, handleSubmit, errors } = useForgotPasswordLogic(onSubmit);

  return (
    <AnimatedPage>
      <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg font-sans mt-12 mb-12">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">
          Quên mật khẩu
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
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
            onClick={() => navigate(-1)}
            className="mt-6 w-full py-3 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Quay lại
          </button>
        )}

        <div className="mt-8 text-center text-gray-600 font-semibold">
          <p>
            Đã có tài khoản?{" "}
            <span
              onClick={() =>
                navigate("/home", { state: { modal: "login" }, replace: true })
              }
              className="text-red-600 hover:underline cursor-pointer"
            >
              Đăng nhập lại
            </span>
          </p>

          <div className="my-6 flex items-center gap-4">
            <hr className="flex-grow border-gray-300" />
            <span className="text-gray-500 text-sm">Hoặc đăng nhập bằng</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <SocialLogin />
        </div>
      </div>
    </AnimatedPage>
  );
}
export default ForgotPasswordForm;

