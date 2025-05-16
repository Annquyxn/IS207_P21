import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { apiLogin } from "@/components/services/apiLogin";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AnimatedDiv from "@/components/ui/AnimatedDiv";
import AnimatedButton from "@/components/ui/AnimatedButton";

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: apiLogin,
    onSuccess: (user) => {
      console.log("Đăng nhập thành công:", user);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/dashboard");
    },
    onError: (error) => {
      alert(error.message || "Đăng nhập thất bại");
    },
  });

  const onSubmit = (data) => {
    loginMutation.mutate(data);
  };

  return (
    <AnimatedDiv
      className="max-w-md mx-auto bg-white px-6 py-10 rounded-2xl shadow-lg transform transition-transform duration-300 hover:scale-101 font-sans mt-10"
      delay={0}
    >
      <AnimatedDiv
        delay={0.1}
        className="text-4xl font-extrabold text-center mb-8 text-gray-900"
      >
        Đăng Nhập
      </AnimatedDiv>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <AnimatedDiv delay={0.2}>
          <input
            type="text"
            placeholder="Email hoặc Số điện thoại"
            className="w-full px-4 py-3 border rounded-lg text-lg focus:ring-2 focus:ring-red-500 transition"
            {...register("username", {
              required: "Vui lòng nhập email hoặc số điện thoại",
            })}
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">
              {errors.username.message}
            </p>
          )}
        </AnimatedDiv>

        <AnimatedDiv delay={0.3} className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Mật khẩu"
            className="w-full px-4 py-3 border rounded-lg pr-12 text-lg focus:ring-2 focus:ring-red-500 transition"
            {...register("password", { required: "Vui lòng nhập mật khẩu" })}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-sm text-gray-600"
          >
            {showPassword ? "Ẩn" : "Hiện"}
          </button>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </AnimatedDiv>

        <div className="flex justify-between items-center text-sm text-red-600 mt-1">
          <Link to="/forgot-password" className="hover:underline">
            Quên mật khẩu?
          </Link>
          <Link to="/register" className="hover:underline">
            Đăng ký
          </Link>
        </div>

        <AnimatedButton
          type="submit"
          className="w-full py-3 bg-red-600 text-white text-lg font-semibold rounded-lg hover:bg-red-700 transition-transform transform hover:scale-105 relative"
          disabled={loginMutation.isLoading}
          delay={0.4}
        >
          {loginMutation.isLoading ? (
            <div className="absolute inset-0 flex justify-center items-center">
              <div className="w-6 h-6 border-4 border-t-4 border-white rounded-full animate-spin"></div>
            </div>
          ) : (
            "Đăng nhập"
          )}
        </AnimatedButton>
      </form>

      <div className="my-6 flex items-center gap-4">
        <hr className="flex-grow border-gray-300" />
        <span className="text-gray-500 text-sm">Hoặc đăng nhập bằng</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      <AnimatedDiv delay={0.5} className="space-y-4">
        <AnimatedButton
          className="w-full flex items-center justify-center gap-2 py-2 border rounded-lg hover:bg-gray-50 transition-transform transform hover:scale-105 text-lg font-medium"
          delay={0.5}
        >
          <img src="/public/google.svg" className="w-6 h-6" alt="Google" />
          <span>Google</span>
        </AnimatedButton>

        <AnimatedButton
          className="w-full flex items-center justify-center gap-2 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105 text-lg font-medium"
          delay={0.6}
        >
          <img src="/public/facebook.svg" className="w-6 h-6" alt="Facebook" />
          <span>Facebook</span>
        </AnimatedButton>
      </AnimatedDiv>
    </AnimatedDiv>
  );
}

export default LoginForm;
