import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { apiLogin } from "@/components/services/apiLogin";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

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
    if (pendingLogin && role) {
      if (role === "admin") {
        navigate("/admin", { replace: true }); // Đảm bảo luôn về dashboard
      } else {
        navigate("/home", { replace: true });
      }
      setPendingLogin(false);
    }
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
