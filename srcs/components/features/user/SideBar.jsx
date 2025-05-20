import { Link, useLocation } from "react-router-dom";
import { useUser } from "./UserContext";
import { FaRegUser, FaBoxOpen } from "react-icons/fa";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { BiTime } from "react-icons/bi";
import { FiLogOut } from "react-icons/fi";
import { useAuth } from "../auth/AuthContext";

function Sidebar() {
  const { userInfo } = useUser();
  const location = useLocation();
  const path = location.pathname;
  const { signOut } = useAuth();

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
          to="/"
          icon={<FiLogOut />}
          label="Đăng xuất"
          onClick={signOut}
        />
      </nav>
    </div>
  );
}

function SidebarItem({ icon, label, to, active, onClick }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-3 py-2 rounded cursor-pointer
        ${
          active
            ? "text-red-600 font-semibold"
            : "text-gray-800 hover:bg-gray-100"
        }`}
      onClick={onClick}
    >
      <div className="text-xl">{icon}</div>
      <span className="text-sm">{label}</span>
    </Link>
  );
}

export default Sidebar;
