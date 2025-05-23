import LeftColumn from '@/components/features/columns/LeftColumn';
import CenterColumn from '@/components/features/columns/CenterColumn';
import RightColumn from '@/components/features/columns/RightColumn';
import ChatBotContainer from '@/components/features/chatBot/ChatBotContainer';
import LoginModal from './LoginModal';
import RegistrationModal from './RegistrationModal';
import ForgotPasswordModal from './ForgotPasswordModal';
import ProductFeatured from './ProductFeatured';
import { useLocation, useNavigate } from 'react-router-dom';

function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const modalType = location.state?.modal;

  const handleCloseModal = () => {
    navigate('/home', { replace: true });
  };

  return (
    <main className='bg-white max-w-[1200px] mx-auto px-4 py-12'>
      <div className='grid grid-cols-12 gap-5' style={{ height: 'auto' }}>
        <div className='md:col-span-9 h-full mt-7'>
          <CenterColumn />
        </div>
        <div className='md:col-span-3 h-full'>
          <RightColumn />
        </div>
      </div>

      <div className='grid grid-cols-12 gap-5'>
        <div className='col-span-12'>
          <LeftColumn />
        </div>
      </div>

      <div className='mt-8'>
        <ProductFeatured />
      </div>

      <div className='mt-auto'>
        <ChatBotContainer />
      </div>

      {modalType === 'login' && <LoginModal />}
      {modalType === 'register' && <RegistrationModal />}
      {modalType === 'forgot-password' && (
        <ForgotPasswordModal onClose={handleCloseModal} />
      )}
    </main>
  );
}

export default HomePage;
