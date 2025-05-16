import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import ForgotPasswordForm from "@/components/features/auth/ForgotPasswordForm";

const apiForgotPassword = async ({ email }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === "admin@example.com") {
        resolve({ message: "Link khôi phục đã được gửi" });
      } else {
        reject(new Error("Email không tồn tại trong hệ thống"));
      }
    }, 1500);
  });
};

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const mutation = useMutation({
    mutationFn: apiForgotPassword,
    onSuccess: (data) => {
      alert(data.message);
      navigate("/login");
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <ForgotPasswordForm
      register={register}
      errors={errors}
      onSubmit={handleSubmit(onSubmit)}
      isLoading={mutation.isLoading}
      showBack={true}
      onBack={handleBack}
    />
  );
}

export default ForgotPasswordPage;
