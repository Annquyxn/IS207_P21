import RegistrationForm from '@/components/features/auth/RegistrationForm';
import SocialLogin from '../ui/SocialLogin';
import ModalWrapper from '../ui/ModalWrapper';
import { useNavigate } from 'react-router-dom';

function RegistrationModal() {
  const navigate = useNavigate();
  return (
    <ModalWrapper>
      <h1 className='text-3xl sm:text-4xl font-bold text-gray-900 mb-8 text-center'>
        Đăng ký tài khoản
      </h1>

      <RegistrationForm />

      <div className='flex items-center justify-center mt-6 text-sm'>
        <p className='text-gray-600'>
          Bạn đã có tài khoản?
          <span
            onClick={() =>
              navigate('/home', { state: { modal: 'login' }, replace: true })
            }
            className='ml-2 text-blue-600 hover:text-blue-800 hover:underline font-medium cursor-pointer'
          >
            Đăng nhập
          </span>
        </p>
      </div>

      <div className='flex items-center my-8 w-full text-sm text-gray-600 gap-2'>
        <hr className='flex-1 h-px bg-gray-300' />
        <span className='whitespace-nowrap'>HOẶC</span>
        <hr className='flex-1 h-px bg-gray-300' />
      </div>

      <SocialLogin actionType='register' />
    </ModalWrapper>
  );
}

export default RegistrationModal;
