import { useState, useEffect } from "react";
import { supabase } from "../services/supabase"; // Đảm bảo đường dẫn đúng

function UserDropdownMenu({
  onClose,
  onGoToUser,
  onGoToOrders,
  onSignOut,
  isAdmin: isAdminProp,
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isAdmin, setIsAdmin] = useState(isAdminProp);

  useEffect(() => {
    async function checkAdminRole() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setIsAdmin(false);
        return;
      }
      const { data } = await supabase
        .from("user_admin")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(!!(data && data.role === "admin"));
    }
    checkAdminRole();
  }, []);

  return (
    <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg py-2 z-50">
      <button
        className="w-full text-left px-4 py-2 hover:bg-gray-100"
        onClick={() => {
          onGoToUser();
          onClose();
        }}
      >
        Thông tin tài khoản
      </button>
      <button
        className="w-full text-left px-4 py-2 hover:bg-gray-100"
        onClick={() => {
          onGoToOrders();
          onClose();
        }}
      >
        Đơn hàng của tôi
      </button>
      {isAdmin && (
        <button
          className="w-full text-left px-4 py-2 hover:bg-gray-100"
          onClick={() => {
            onClose();
            window.location.href = "/admin";
          }}
        >
          Quản lý
        </button>
      )}
      <button
        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
        onClick={() => setShowConfirm(true)}
      >
        Đăng xuất
      </button>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg text-center">
            <h2 className="text-lg font-semibold mb-4">
              Bạn chắc chắn muốn đăng xuất?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition"
                onClick={() => setShowConfirm(false)}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
                onClick={() => {
                  onSignOut();
                  onClose();
                  setShowConfirm(false);
                }}
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDropdownMenu;
