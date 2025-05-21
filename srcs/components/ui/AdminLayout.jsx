// src/layouts/AdminLayout.jsx
import { Outlet } from "react-router-dom";
import AdminSideBar from "./AdminSideBar";
import { useAuth } from "../features/auth/AuthContext";
import { FiLogOut } from "react-icons/fi";

const AdminLayout = () => {
  const { signOut } = useAuth();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSideBar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold text-gray-800">
            Admin Dashboard
          </h1>
          <button
            onClick={signOut}
            className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
          >
            <FiLogOut className="text-xl" />
            <span>Đăng xuất</span>
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
