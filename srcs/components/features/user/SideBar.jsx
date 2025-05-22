import { Link, useLocation } from "react-router-dom";
import { useUser } from "./UserContext";
import { FaRegUser, FaBoxOpen } from "react-icons/fa";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { BiTime } from "react-icons/bi";
import { FiLogOut } from "react-icons/fi";
import { useAuth } from "../auth/AuthContext";

function SidebarItem({ to, icon, label, active, onClick }) {
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`flex items-center gap-3 px-4 py-2 w-full text-left hover:bg-gray-100 transition-colors ${
          active ? "text-red-600" : "text-gray-700"
        }`}
      >
        {icon}
        <span>{label}</span>
      </button>
    );
  }

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors ${
        active ? "text-red-600" : "text-gray-700"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

function Sidebar() {
  const { userInfo } = useUser();
  const location = useLocation();
  const path = location.pathname;
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      // No need to navigate here since signOut function handles it
    } catch (error) {
      console.error("Error signing out:", error);
      // Force reload on error
      window.location.href = "/home";
    }
  };

  return (
    <div className="bg-white border rounded-xl w-full shadow p-4">
      <div className="text-center mb-4">
        <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-2 border-2 border-gray-300">
          <img
            src="/public/default-user.jpg"
            alt="avatar"
            className="w-full h-full object-cover"
          />
        </div>

        <h2 className="font-semibold text-lg">
          {userInfo?.fullName || "Người dùng"}
        </h2>
      </div>

      <hr className="my-3" />

      <nav className="flex flex-col gap-3">
        <SidebarItem
          to="/user"
          icon={<FaRegUser />}
          label="Thông tin tài khoản"
          active={path === "/user"}
        />
        <SidebarItem
          to="/user/address"
          icon={<HiOutlineLocationMarker />}
          label="Địa chỉ"
          active={path === "/user/address"}
        />
        <SidebarItem
          to="/user/orders"
          icon={<FaBoxOpen />}
          label="Quản lý đơn hàng"
          active={path === "/user/orders"}
        />
        <SidebarItem
          to="/user/history"
          icon={<BiTime />}
          label="Lịch sử mua hàng"
          active={path === "/user/history"}
        />
        <SidebarItem
          icon={<FiLogOut />}
          label="Đăng xuất"
          onClick={handleSignOut}
        />
      </nav>
    </div>
  );
}

export default Sidebar;
