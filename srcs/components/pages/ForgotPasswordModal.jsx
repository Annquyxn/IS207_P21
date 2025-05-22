import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import ModalWrapper from "../ui/ModalWrapper";
import { toast } from "react-hot-toast";
import { supabase } from "../services/supabase";

export default function ForgotPasswordModal({ onClose }) {
  const [email, setEmail] = useState("");

  const { mutate: sendResetLink, isLoading: isEmailLoading } = useMutation({
    mutationFn: async ({ email }) => {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password#access_token=`,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Link đặt lại mật khẩu đã được gửi đến email của bạn!");
      onClose();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    sendResetLink({ email });
  };

  return (
    <ModalWrapper onClose={onClose}>
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">
          Quên mật khẩu?
        </h2>

        <p className="text-gray-600 text-center mb-8">
          Nhập email của bạn và chúng tôi sẽ gửi link đặt lại mật khẩu
        </p>

        <form onSubmit={handleEmailSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Nhập email của bạn"
              className="w-full px-4 py-3 border rounded-lg text-lg focus:ring-2 focus:ring-red-500 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isEmailLoading}
            className="w-full py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50"
          >
            {isEmailLoading ? "Đang gửi..." : "Gửi link đặt lại mật khẩu"}
          </button>
        </form>
      </div>
    </ModalWrapper>
  );
}
