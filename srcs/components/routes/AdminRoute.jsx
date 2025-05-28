import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/components/services/supabase";
import Spinner from "../ui/Spinner";

// DEVELOPMENT MODE - Authentication Bypass
const BYPASS_AUTH = false; // Tắt bypass để kiểm tra thực quyền

const AdminRoute = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (user) {
        // Lấy user id
        const userId = user.id || user?.user?.id;
        if (userId) {
          // Truy vấn bảng user_admin để kiểm tra quyền admin
          const { data, error } = await supabase
            .from("user_admin")
            .select("role")
            .eq("user_id", userId)
            .single();
          setIsAdmin(!error && data?.role === "admin");
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    };
    checkAdminRole();
  }, [user]);

  if (loading) {
    return <Spinner className="w-10 h-10" />;
  }

  // Không bypass, kiểm tra quyền thực tế
  if (!user || !isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Bạn không có quyền truy cập
        </h2>
        <p className="text-gray-600 mb-6">
          Vui lòng đăng nhập bằng tài khoản admin để truy cập trang này.
        </p>
      </div>
    );
  }

  return <Outlet />;
};

export default AdminRoute;
