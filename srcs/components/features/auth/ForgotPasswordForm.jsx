import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedPage from "@/components/ui/AnimatedPage";

function ForgotPasswordForm({ showBack = false }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(
        "http://localhost/Do_An_Web/IS207_P21/php_files/sendresetemail.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Đã xảy ra lỗi khi gửi email");
      }

      setSuccess(true);
      // XÓA hoặc COMMENT dòng này nếu không muốn chuyển trang:
      // setTimeout(() => {
      //   navigate("/home", { state: { modal: "login" }, replace: true });
      // }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Lấy token từ hash
  const hash = window.location.hash;
  const token = new URLSearchParams(hash.replace("#", "")).get("access_token");

  useEffect(() => {
    console.log("Hash hiện tại:", window.location.hash);
    console.log("Token lấy được:", token);
  }, []);

  return (
    <AnimatedPage>
      <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg font-sans mt-12 mb-12">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">
          Quên mật khẩu
        </h2>

        {success ? (
          <div className="text-center text-green-600">
            <p className="text-lg font-medium">
              Email đặt lại mật khẩu đã được gửi!
            </p>
            <p className="mt-2">Vui lòng kiểm tra email của bạn.</p>
            <p className="mt-2">Đang chuyển hướng đến trang đăng nhập...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="email"
                placeholder="Email của bạn"
                className="w-full px-4 py-3 border rounded-lg text-lg focus:ring-2 focus:ring-red-500 transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              {isLoading ? "Đang xử lý..." : "Gửi link đặt lại mật khẩu"}
            </button>

            {showBack && (
              <button
                type="button"
                onClick={() => navigate("/home", { state: { modal: "login" } })}
                className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Quay lại đăng nhập
              </button>
            )}
          </form>
        )}
      </div>
    </AnimatedPage>
  );
}

export default ForgotPasswordForm;
