import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { apiLogin } from "@/components/services/apiLogin";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/components/services/supabase";

export function useLoginFormLogic() {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const mutation = useMutation({
    mutationFn: apiLogin,
    onSuccess: async (data) => {
      try {
        setLoginError("");

        // Lưu thông tin user vào localStorage
        localStorage.setItem("user", JSON.stringify(data.user));

        // Kiểm tra role của người dùng
        const {
          data: { user: userData },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          console.error("Error getting user data:", userError);
          setLoginError("Lỗi khi lấy thông tin người dùng");
          return;
        }

        const isAdmin = userData?.user_metadata?.role === "admin";

        // Chuyển hướng dựa vào role
        if (isAdmin) {
          navigate("/admin", { replace: true });
        } else {
          navigate("/user", { replace: true });
        }
      } catch (error) {
        console.error("Error in login success handler:", error);
        setLoginError("Có lỗi xảy ra sau khi đăng nhập");
      }
    },
    onError: (error) => {
      console.error("Login error:", error);
      setLoginError(error.message || "Đăng nhập thất bại");
    },
  });

  const onSubmit = (data) => mutation.mutate(data);

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    isLoading: mutation.isLoading,
    loginError,
  };
}
