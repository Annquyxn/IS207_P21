import { Outlet, useLocation } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';

function Layout() {
  const location = useLocation();
  const hiddenRoutes = ['/login', '/register', '/forgot-password'];
  const hideHeaderFooter = hiddenRoutes.includes(location.pathname);

  return (
    <div className='min-h-screen flex flex-col bg-gray-50'>
      {!hideHeaderFooter && <Header />}
      <main className='flex-1'>
        <Outlet />
      </main>
      {!hideHeaderFooter && <Footer />}
    </div>
  );
}

export default Layout;
