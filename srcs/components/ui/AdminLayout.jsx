import { Outlet, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../features/auth/AuthContext';
import { Link } from 'react-router-dom';
import {
  FiMenu,
  FiX,
  FiLogOut,
  FiBell,
  FiUser,
  FiChevronDown,
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLayout = ({ routes }) => {
  const { signOut } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications] = useState([
    { id: 1, message: 'Đơn hàng mới #12345' },
    { id: 2, message: 'Sản phẩm Laptop Dell hết hàng' },
    { id: 3, message: '5 người dùng mới đăng ký' },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  const location = useLocation();

  const currentRoute = routes?.find(
    (route) =>
      location.pathname === `/admin/${route.path}` ||
      (location.pathname === '/admin' && route.path === '')
  );

  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className='flex h-screen bg-gray-100 overflow-hidden font-sans'>
      {isMobileSidebarOpen && (
        <div
          className='fixed inset-0 bg-gray-900 bg-opacity-50 z-20 lg:hidden'
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}
      <aside
        className={`
          ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transition duration-300 transform lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        <div className='flex items-center justify-between h-16 px-6 bg-red-600 text-white'>
          <div className='flex items-center space-x-2'>
            <img src='/public/logo-1.png' alt='Logo' className='w-8 h-8' />
            <h1 className='text-xl font-bold'>PC World Admin</h1>
          </div>
          <button
            className='lg:hidden text-white focus:outline-none'
            onClick={() => setIsMobileSidebarOpen(false)}
          >
            <FiX className='h-6 w-6' />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className='mt-4 px-4'>
          <ul className='space-y-1'>
            {routes?.map((route) => (
              <li key={route.path}>
                <Link
                  to={`/admin/${route.path}`}
                  className={`
                    flex items-center px-4 py-3 text-gray-700 rounded-lg transition-colors
                    ${
                      location.pathname === `/admin/${route.path}` ||
                      (location.pathname === '/admin' && route.path === '')
                        ? 'bg-red-50 text-red-600'
                        : 'hover:bg-gray-100'
                    }
                  `}
                >
                  <span className='text-xl mr-3'>{route.icon}</span>
                  <span>{route.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      {/* Main Content */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* Header */}
        <header className='bg-white shadow-sm h-16 flex items-center justify-between px-6 z-10'>
          <div className='flex items-center'>
            <button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className='text-gray-600 focus:outline-none lg:hidden'
            >
              <FiMenu className='h-6 w-6' />
            </button>
            <motion.div
              key={currentRoute?.name || 'Dashboard'}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className='ml-4 flex items-center'
            >
              <span className='text-red-600 text-xl mr-2'>
                {currentRoute?.icon}
              </span>
              <h1 className='text-xl font-semibold text-gray-800'>
                {currentRoute?.name || 'Tổng quan'}
              </h1>
            </motion.div>
          </div>

          <div className='flex items-center space-x-4'>
            {/* Notifications */}
            <div className='relative'>
              <button
                className='text-gray-600 hover:text-red-600 focus:outline-none relative transition-colors'
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <FiBell className='h-6 w-6' />
                {notifications.length > 0 && (
                  <span className='absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold'>
                    {notifications.length}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className='absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg overflow-hidden z-50'
                  >
                    <div className='p-3 bg-gray-50 border-b border-gray-200'>
                      <h3 className='font-semibold text-gray-700'>
                        Thông báo ({notifications.length})
                      </h3>
                    </div>
                    <div className='max-h-64 overflow-y-auto'>
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className='p-3 hover:bg-gray-50 border-b border-gray-100'
                        >
                          <p className='text-sm text-gray-800'>
                            {notification.message}
                          </p>
                          <p className='text-xs text-gray-500 mt-1'>Vừa xong</p>
                        </div>
                      ))}
                    </div>
                    <div className='p-2 bg-gray-50 text-center'>
                      <button className='text-sm text-red-600 hover:text-red-800 font-medium'>
                        Xem tất cả
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Menu */}
            <div className='relative'>
              <button
                className='flex items-center text-gray-700 hover:text-red-600 focus:outline-none transition-colors'
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className='h-8 w-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center mr-2'>
                  <FiUser className='h-5 w-5' />
                </div>
                <span className='font-medium mr-1 hidden md:block'>Admin</span>
                <FiChevronDown
                  className={`transition-transform duration-200 ${
                    showUserMenu ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-50'
                  >
                    <div className='py-2'>
                      <Link
                        to='/admin/settings'
                        className='block px-4 py-2 text-gray-700 hover:bg-gray-100'
                      >
                        Cài đặt tài khoản
                      </Link>
                      <button
                        onClick={signOut}
                        className='block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100'
                      >
                        <span className='flex items-center'>
                          <FiLogOut className='mr-2' />
                          Đăng xuất
                        </span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className='flex-1 overflow-auto p-6 bg-gray-100'>
          <AnimatePresence mode='wait'>
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
