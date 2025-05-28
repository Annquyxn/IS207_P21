import {
  IoChevronDownOutline,
  IoSearchOutline,
  IoNotificationsOutline,
  IoCartOutline,
  IoPersonOutline,
} from "react-icons/io5";
import { LiaPuzzlePieceSolid } from "react-icons/lia";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import LaptopCategories from "../features/categories/LaptopCategories";
import NotificationList from "../features/notify/NotificationList";
import { useNotifications } from "../features/notify/NotificationContext";
import { useAuth } from "../features/auth/AuthContext";
import { useUser } from "../features/user/UserContext";
import { useCart } from "@/utils/CartContext";
import UserDropdownMenu from "./UserDropdownMenu";
import Search from "../features/search/Search";

function Header() {
  const [showCategories, setShowCategories] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notificationRef = useRef(null);
  const userMenuRef = useRef(null);
  const hideTimeoutRef = useRef(null);
  const navigate = useNavigate();
  const { newCount: notificationCount } = useNotifications();
  const { user, signOut } = useAuth();
  const { userInfo } = useUser();
  const { cart } = useCart();

  const isAdmin = userInfo?.role === "admin";

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  const handleLoginClick = () => {
    navigate("/home", { state: { modal: "login" } });
  };

  const handleShoppingClick = () => {
    navigate("/shopping-cart");
  };

  const handleUserMenuClick = () => {
    setShowUserMenu((prev) => !prev);
  };

  const handleGoToUser = () => {
    navigate("/user");
    setShowUserMenu(false);
  };

  const handleGoToOrders = () => {
    navigate("/user/orders");
    setShowUserMenu(false);
  };

  const handleSignOut = () => {
    signOut();
    setShowUserMenu(false);
    navigate("/home");
  };

  const handleGoToBuilPC = () => {
    navigate("/build-PC");
  };

  return (
    <header className="bg-red-600 text-white py-3 px-6 shadow-lg sticky top-0 z-50 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-grow relative">
          <div
            className="flex items-center gap-2 cursor-pointer hover:bg-red-700 hover:scale-105 hover:shadow-lg px-3 py-2 rounded-lg transition-all duration-300 ease-in-out"
            onClick={() => navigate("/home")}
          >
            <img
              src="/public/logo-1.png"
              alt="GearVN Logo"
              className="w-10 h-10 object-contain"
            />
            <span className="text-sm font-bold text-white hidden md:inline">
              CLONE
            </span>
          </div>

          {/* DANH MỤC */}
          <div
            className="group relative"
            onMouseEnter={() => {
              clearTimeout(hideTimeoutRef.current);
              setShowCategories(true);
            }}
            onMouseLeave={() => {
              hideTimeoutRef.current = setTimeout(() => {
                setShowCategories(false);
              }, 200);
            }}
          >
            <div
              className="flex items-center gap-2 bg-red-700 px-4 py-2 rounded-lg cursor-pointer hover:bg-red-800 hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out"
              onClick={() => setShowCategories(!showCategories)}
            >
              <span className="text-base font-semibold tracking-wide">
                Danh mục
              </span>
              <IoChevronDownOutline
                className={`text-xl transition-transform ${
                  showCategories ? "rotate-180" : ""
                }`}
              />
            </div>
            {showCategories && (
              <LaptopCategories onClose={() => setShowCategories(false)} />
            )}
          </div>

          <div className="relative flex-grow max-w-xl">
            <Search />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div
            className="flex items-center gap-2 cursor-pointer hover:bg-red-700 hover:scale-105 hover:shadow-lg px-3 py-2 rounded-lg transition-all duration-300 ease-in-out"
            onClick={handleGoToBuilPC}
          >
            <LiaPuzzlePieceSolid className="text-xl" />
            <span className="text-base font-medium">Build PC</span>
          </div>

          <div className="relative" ref={notificationRef}>
            <div
              className="flex items-center gap-2 cursor-pointer hover:bg-red-700 hover:scale-105 hover:shadow-lg px-3 py-2 rounded-lg transition-all duration-300 ease-in-out"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <div className="relative">
                <IoNotificationsOutline className="text-xl" />
                {notificationCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-red-700 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </div>
              <span className="text-base font-medium">Thông báo</span>
            </div>
            {showNotifications && <NotificationList />}
          </div>

          <div
            className="relative flex items-center gap-2 cursor-pointer hover:bg-red-700 hover:scale-105 hover:shadow-lg px-3 py-2 rounded-lg transition-all duration-300 ease-in-out"
            onClick={handleShoppingClick}
          >
            <div className="relative">
              <IoCartOutline className="text-xl" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-red-700 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.length > 9 ? "9+" : cart.length}
                </span>
              )}
            </div>
            <span className="text-base font-medium">Giỏ hàng</span>
          </div>

          {user ? (
            <div className="relative" ref={userMenuRef}>
              <div
                className="flex items-center gap-2 bg-orange-500 px-4 py-2 rounded-full cursor-pointer hover:bg-orange-600 hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out"
                onClick={handleUserMenuClick}
              >
                <img
                  src={"/public/default-user.jpg"}
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover border-2 border-white"
                />
                <span className="text-base font-semibold">
                  {userInfo?.fullName || userInfo?.email || "User"}
                </span>
                <IoChevronDownOutline className="text-lg" />
              </div>
              {showUserMenu && (
                <UserDropdownMenu
                  isAdmin={isAdmin}
                  onClose={() => setShowUserMenu(false)}
                  onGoToUser={handleGoToUser}
                  onGoToOrders={handleGoToOrders}
                  onSignOut={handleSignOut}
                />
              )}
            </div>
          ) : (
            <div
              className="flex items-center gap-2 bg-orange-500 px-4 py-2 rounded-full cursor-pointer hover:bg-orange-600 hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out"
              onClick={handleLoginClick}
            >
              <IoPersonOutline className="text-xl" />
              <span className="text-base font-semibold">Đăng nhập</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
