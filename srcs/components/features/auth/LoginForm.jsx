import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { apiLogin } from "@/components/services/apiLogin";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

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
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md"
    >
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-3xl font-bold text-center mb-8"
      >
        Đăng Nhập
      </motion.h1>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <input
            type="text"
            placeholder="Email hoặc Số điện thoại"
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 transition"
            {...register("username", {
              required: "Vui lòng nhập email hoặc số điện thoại",
            })}
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">
              {errors.username.message}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative"
        >
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Mật khẩu"
            className="w-full px-4 py-3 border rounded-lg pr-12 focus:ring-2 focus:ring-red-500 transition"
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
        </motion.div>

        <a
          href="#"
          className="block text-right text-sm text-red-600 hover:underline"
        >
          Quên mật khẩu?
        </a>

        <motion.button
          type="submit"
          className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition relative"
          disabled={loginMutation.isLoading}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {loginMutation.isLoading ? (
            <div className="absolute inset-0 flex justify-center items-center">
              <div className="w-6 h-6 border-4 border-t-4 border-white rounded-full animate-spin"></div>
            </div>
          ) : (
            "Đăng nhập"
          )}
        </motion.button>
      </form>

      <div className="my-6 flex items-center gap-4">
        <hr className="flex-grow border-gray-300" />
        <span className="text-gray-500">Hoặc đăng nhập bằng</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="space-y-4"
      >
        <motion.button
          className="w-full flex items-center justify-center gap-2 py-2 border rounded-lg hover:bg-gray-50 transition"
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
        >
          <img src="/google-icon.svg" className="w-6 h-6" alt="Google" />
          <span>Google</span>
        </motion.button>

        <motion.button
          className="w-full flex items-center justify-center gap-2 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
        >
          <img src="/facebook-icon.svg" className="w-6 h-6" alt="Facebook" />
          <span>Facebook</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

export default LoginForm;
