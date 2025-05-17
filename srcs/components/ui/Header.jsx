import {
  IoChevronDownOutline,
  IoSearchOutline,
  IoLocationOutline,
  IoNotificationsOutline,
  IoCartOutline,
  IoPersonOutline,
} from 'react-icons/io5';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LaptopCategories from '../features/categories/LaptopCategories';
import NotificationList from '../features/notify/NotificationList';

function Header() {
  const [showCategories, setShowCategories] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  const navigate = useNavigate();

  const handleCloseCategories = () => setShowCategories(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Hàm chuyển sang trang đăng nhập
  const handleLoginClick = () => {
    navigate('/home', { state: { modal: 'login' } });
  };

  return (
    <header className='bg-red-600 text-white py-3 px-6 shadow-lg sticky top-0 z-50 font-sans'>
      <div className='flex flex-wrap items-center justify-between gap-4'>
        {/* Left Section */}
        <div className='flex items-center gap-4 flex-grow relative'>
          {/* Danh mục */}
          <div
            className='group relative'
            onMouseEnter={() => setShowCategories(true)}
            onMouseLeave={() => setShowCategories(false)}
          >
            <div
              className='flex items-center gap-2 bg-red-700 px-4 py-2 rounded-lg cursor-pointer 
                hover:bg-red-800 hover:scale-105 hover:shadow-lg 
                transition-all duration-300 ease-in-out'
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
              <LaptopCategories onClose={handleCloseCategories} />
            )}
          </div>

          {/* Search */}
          <div className='relative flex-grow max-w-xl'>
            <div className='bg-white flex items-center rounded-full px-6 py-2 shadow-sm'>
              <input
                type='text'
                placeholder='Tìm kiếm sản phẩm...'
                className='flex-grow outline-none text-gray-800 bg-transparent text-base placeholder:text-gray-500'
              />
              <IoSearchOutline className='text-2xl text-gray-600 ml-2' />
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className='flex items-center gap-4'>
          {/* Địa chỉ */}
          <div className='flex items-center gap-2 cursor-pointer hover:bg-red-700 hover:scale-105 hover:shadow-lg px-3 py-2 rounded-lg transition-all duration-300 ease-in-out'>
            <IoLocationOutline className='text-xl' />
            <span className='text-base font-medium'>Địa chỉ</span>
          </div>

          {/* Thông báo */}
          <div className='relative' ref={notificationRef}>
            <div
              className='flex items-center gap-2 cursor-pointer hover:bg-red-700 hover:scale-105 hover:shadow-lg px-3 py-2 rounded-lg transition-all duration-300 ease-in-out'
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <IoNotificationsOutline className='text-xl' />
              <span className='text-base font-medium'>Thông báo</span>
            </div>
            {showNotifications && <NotificationList />}
          </div>

          {/* Giỏ hàng */}
          <div className='flex items-center gap-2 cursor-pointer hover:bg-red-700 hover:scale-105 hover:shadow-lg px-3 py-2 rounded-lg transition-all duration-300 ease-in-out'>
            <IoCartOutline className='text-xl' />
            <span className='text-base font-medium'>Giỏ hàng</span>
          </div>

          {/* Đăng nhập */}
          <div
            className='flex items-center gap-2 bg-orange-500 px-4 py-2 rounded-full cursor-pointer hover:bg-orange-600 hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out'
            onClick={handleLoginClick}
          >
            <IoPersonOutline className='text-xl' />
            <span className='text-base font-semibold'>Đăng nhập</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
