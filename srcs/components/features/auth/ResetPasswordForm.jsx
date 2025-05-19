import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedPage from "@/components/ui/AnimatedPage";

function ResetPasswordForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  // Lấy token từ hash hoặc localStorage
  let hash = window.location.hash;
  let token =
    new URLSearchParams(hash.replace("#", "")).get("access_token") ||
    localStorage.getItem("reset_token");

  useEffect(() => {
    const hashToken = new URLSearchParams(
      window.location.hash.replace("#", "")
    ).get("access_token");
    if (hashToken) {
      localStorage.setItem("reset_token", hashToken);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu không khớp");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      setIsLoading(false);
      return;
    }

    try {
      if (!token) {
        throw new Error("Token không hợp lệ");
      }

      const response = await fetch(
        "http://localhost/Do_An_Web/IS207_P21/php_files/resetpassword.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: formData.password,
            token: token,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.log(data);
        throw new Error(data.error || "Đã xảy ra lỗi khi đặt lại mật khẩu");
      }

      setSuccess(true);
      setTimeout(() => {
        localStorage.removeItem("reset_token");
        navigate("/home", { state: { modal: "login" }, replace: true });
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatedPage>
      <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg font-sans mt-12 mb-12">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">
          Đặt lại mật khẩu
        </h2>

        {success ? (
          <div className="text-center text-green-600">
            <p className="text-lg font-medium">Đặt lại mật khẩu thành công!</p>
            <p className="mt-2">Đang chuyển hướng đến trang đăng nhập...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="password"
                name="password"
                placeholder="Mật khẩu mới"
                className="w-full px-4 py-3 border rounded-lg text-lg focus:ring-2 focus:ring-red-500 transition"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Xác nhận mật khẩu mới"
                className="w-full px-4 py-3 border rounded-lg text-lg focus:ring-2 focus:ring-red-500 transition"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm font-medium">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-transform transform hover:scale-105"
            >
              {isLoading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
            </button>
          </form>
        )}
      </div>
    </AnimatedPage>
  );
}

export default ResetPasswordForm;
