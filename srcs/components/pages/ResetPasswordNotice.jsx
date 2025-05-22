import React from "react";
import AnimatedPage from "@/components/ui/AnimatedPage";
import { Link } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";

export default function ResetPasswordNotice() {
  return (
    <AnimatedPage>
      <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg font-sans mt-12 mb-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">
            Kiểm tra email của bạn
          </h2>
          <div className="mb-6 flex justify-center">
            <FaEnvelope className="w-16 h-16 text-red-600" />
          </div>
          <p className="text-lg text-gray-600 mb-4">
            Chúng tôi đã gửi email hướng dẫn đặt lại mật khẩu đến địa chỉ email
            của bạn.
          </p>
          <p className="text-gray-500 mb-6">
            Vui lòng kiểm tra hộp thư đến và làm theo hướng dẫn để đặt lại mật
            khẩu. Nếu bạn không thấy email trong hộp thư đến, hãy kiểm tra thư
            mục spam.
          </p>
          <div className="space-y-4">
            <Link
              to="/home"
              className="block w-full py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Về trang chủ
            </Link>
            <Link
              to="/forgot-password"
              className="block w-full py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Gửi lại email
            </Link>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}
