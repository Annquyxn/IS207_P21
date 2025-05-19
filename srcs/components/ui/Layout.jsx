import { Outlet, useLocation } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';
import ChatBotContainer from '../features/chatBot/ChatBotContainer';

function Layout() {
  const location = useLocation();
  const hiddenRoutes = ['/login', '/register', '/forgot-password'];
  const hideHeaderFooter = hiddenRoutes.includes(location.pathname);

  return (
    <div className='min-h-screen flex flex-col bg-gray-50'>
      {!hideHeaderFooter && <Header />}
      <main className='flex-1'>
        <Outlet key={location.key} />
      </main>
      {!hideHeaderFooter && <Footer />}
      {!hideHeaderFooter && <ChatBotContainer />}
    </div>
  );
}

export default Layout;
