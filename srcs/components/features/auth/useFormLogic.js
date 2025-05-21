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
    onSuccess: async (user) => {
      setLoginError("");
      // Lưu thông tin user vào localStorage
      localStorage.setItem("user", JSON.stringify(user));

      // Cập nhật session trong Supabase
      const { error } = await supabase.auth.getSession();
      if (error) {
        setLoginError("Lỗi khi cập nhật phiên đăng nhập");
        return;
      }

      // Kiểm tra role của người dùng
      const {
        data: { user: userData },
      } = await supabase.auth.getUser();
      const isAdmin = userData?.user_metadata?.role === "admin";

      // Chuyển hướng dựa vào role
      if (isAdmin) {
        navigate("/admin", { replace: true });
      } else {
        navigate("/user", { replace: true });
      }
    },
    onError: (error) => {
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
