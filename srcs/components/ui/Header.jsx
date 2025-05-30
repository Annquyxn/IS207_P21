import {
  IoChevronDownOutline,
  IoNotificationsOutline,
  IoCartOutline,
  IoPersonOutline,
} from 'react-icons/io5';
import { LiaPuzzlePieceSolid } from 'react-icons/lia';
import { FaUserShield } from 'react-icons/fa';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LaptopCategories from '../features/categories/LaptopCategories';
import NotificationList from '../features/notify/NotificationList';
import { useNotifications } from '../features/notify/NotificationContext';
import { useAuth } from '../features/auth/AuthContext';
import { useUser } from '../features/user/UserContext';
import { useCart } from '@/utils/CartContext';
import { useAdmin } from '../hooks/useAdmin'; // Import hook mới
import UserDropdownMenu from './UserDropdownMenu';
import Search from '../features/search/Search';

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
  const { isAdmin, loading: adminLoading } = useAdmin(); // Sử dụng hook mới

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
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  const handleLoginClick = () => {
    navigate('/home', { state: { modal: 'login' } });
  };

  const handleShoppingClick = () => {
    navigate('/shopping-cart');
  };

  const handleUserMenuClick = () => {
    setShowUserMenu((prev) => !prev);
  };

  const handleGoToUser = () => {
    navigate('/user');
    setShowUserMenu(false);
  };

  const handleGoToOrders = () => {
    navigate('/user/orders');
    setShowUserMenu(false);
  };

  const handleGoToAdmin = () => {
    navigate('/admin');
    setShowUserMenu(false);
  };

  const handleSignOut = () => {
    signOut();
    setShowUserMenu(false);
    navigate('/home');
  };

  const handleGoToBuilPC = () => {
    navigate('/build-PC');
  };

  return (
    <header className='bg-red-600 text-white py-3 px-6 shadow-lg sticky top-0 z-50 font-sans'>
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <div className='flex items-center gap-4 flex-grow relative'>
          {/* LOGO */}
          <div
            className='flex items-center gap-2 cursor-pointer'
            onClick={() => navigate('/home')}
          >
            <img
              src='/srcs/assets/logo/Logo-1.png'
              alt='GearVN Logo'
              className='w-30 h-12 object-contain'
            />
          </div>

          {/* DANH MỤC */}
          <div
            className='group relative'
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
              className='flex items-center gap-2 bg-red-700 px-4 py-2 rounded-lg cursor-pointer hover:bg-red-800 hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out'
              onClick={() => setShowCategories(!showCategories)}
            >
              <span className='text-base font-semibold tracking-wide'>
                Danh mục
              </span>
              <IoChevronDownOutline
                className={`text-xl transition-transform ${
                  showCategories ? 'rotate-180' : ''
                }`}
              />
            </div>
            {showCategories && (
              <LaptopCategories onClose={() => setShowCategories(false)} />
            )}
          </div>

          <div className='relative flex-grow max-w-xl'>
            <Search />
          </div>
        </div>

        <div className='flex items-center gap-4'>
          <div
            className='flex items-center gap-2 cursor-pointer hover:bg-red-700 hover:scale-105 hover:shadow-lg px-3 py-2 rounded-lg transition-all duration-300 ease-in-out'
            onClick={handleGoToBuilPC}
          >
            <LiaPuzzlePieceSolid className='text-xl' />
            <span className='text-base font-medium'>Build PC</span>
          </div>

          {/* Chỉ hiển thị nút Quản lý khi đã load xong và user là admin */}
          {!adminLoading && isAdmin && (
            <div
              className='flex items-center gap-2 cursor-pointer hover:bg-red-700 hover:scale-105 hover:shadow-lg px-3 py-2 rounded-lg transition-all duration-300 ease-in-out'
              onClick={handleGoToAdmin}
            >
              <FaUserShield className='text-xl' />
              <span className='text-base font-medium'>Quản lý</span>
            </div>
          )}

          <div className='relative' ref={notificationRef}>
            <div
              className='flex items-center gap-2 cursor-pointer hover:bg-red-700 hover:scale-105 hover:shadow-lg px-3 py-2 rounded-lg transition-all duration-300 ease-in-out'
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <div className='relative'>
                <IoNotificationsOutline className='text-xl' />
                {notificationCount > 0 && (
                  <span className='absolute -top-2 -right-2 bg-yellow-400 text-red-700 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center'>
                    {notificationCount}
                  </span>
                )}
              </div>
              <span className='text-base font-medium'>Thông báo</span>
            </div>
            {showNotifications && <NotificationList />}
          </div>

          <div
            className='relative flex items-center gap-2 cursor-pointer hover:bg-red-700 hover:scale-105 hover:shadow-lg px-3 py-2 rounded-lg transition-all duration-300 ease-in-out'
            onClick={handleShoppingClick}
          >
            <div className='relative'>
              <IoCartOutline className='text-xl' />
              {cart.length > 0 && (
                <span className='absolute -top-2 -right-2 bg-yellow-400 text-red-700 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center'>
                  {cart.length > 9 ? '9+' : cart.length}
                </span>
              )}
            </div>
            <span className='text-base font-medium'>Giỏ hàng</span>
          </div>

          {user ? (
            <div className='relative' ref={userMenuRef}>
              <div
                className='flex items-center gap-2 bg-orange-500 px-4 py-2 rounded-full cursor-pointer hover:bg-orange-600 hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out'
                onClick={handleUserMenuClick}
              >
                <img
                  src={'/public/default-user.jpg'}
                  alt='avatar'
                  className='w-8 h-8 rounded-full object-cover border-2 border-white'
                />
                <span className='text-base font-semibold'>
                  {userInfo?.fullName || userInfo?.email || 'User'}
                </span>
                <IoChevronDownOutline className='text-lg' />
              </div>
              {showUserMenu && (
                <UserDropdownMenu
                  isAdmin={isAdmin}
                  onClose={() => setShowUserMenu(false)}
                  onGoToUser={handleGoToUser}
                  onGoToOrders={handleGoToOrders}
                  onGoToAdmin={handleGoToAdmin}
                  onSignOut={handleSignOut}
                />
              )}
            </div>
          ) : (
            <div
              className='flex items-center gap-2 bg-orange-500 px-4 py-2 rounded-full cursor-pointer hover:bg-orange-600 hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out'
              onClick={handleLoginClick}
            >
              <IoPersonOutline className='text-xl' />
              <span className='text-base font-semibold'>Đăng nhập</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
