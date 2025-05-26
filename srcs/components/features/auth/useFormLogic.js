import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { apiLogin } from "@/components/services/apiLogin";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "@/components/services/supabase";

export function useLoginFormLogic() {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");
  const { role } = useAuth();
  const [pendingLogin, setPendingLogin] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const mutation = useMutation({
    mutationFn: apiLogin,

    onSuccess: async (user) => {
      try {
        setLoginError("");
        localStorage.setItem("user", JSON.stringify(user));
        setPendingLogin(true); // Mark that we are waiting for role update
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

  // Redirect after role is updated
  useEffect(() => {
    async function checkAndRedirect() {
      if (pendingLogin) {
        let userId = null;
        try {
          const user = JSON.parse(localStorage.getItem("user"));
          userId = user?.user?.id || user?.id;
        } catch (e) {
          // ignore
        }
        let isAdmin = false;
        if (userId) {
          // Truy vấn role, email, full_name từ bảng public.user_admin
          const { data, error } = await supabase
            .from("user_admin")
            .select("role, email, full_name")
            .eq("user_id", userId)
            .single();
          if (!error && data?.role === "admin") {
            isAdmin = true;
          }
        }
        if (isAdmin) {
          navigate("/admin", { replace: true, state: {} });
        } else {
          navigate("/home", { replace: true, state: {} });
        }
        setPendingLogin(false);
      }
    }
    checkAndRedirect();
  }, [pendingLogin, role, navigate]);

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
