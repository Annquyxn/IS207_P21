import RegistrationForm from '@/components/features/auth/RegistrationForm';
import SocialLogin from '../ui/SocialLogin';
import ModalWrapper from '../ui/ModalWrapper';
import { useNavigate } from 'react-router-dom';

function RegistrationModal() {
  const navigate = useNavigate();

  return (
    <ModalWrapper>
      <div className='z-50 max-w-4xl w-full bg-white/100 rounded-xl overflow-hidden'>
        {/* Header */}
        <div className='text-3xl font-bold text-center py-4 bg-red-500 border-b border-red-800 text-white'>
          Đăng ký tài khoản
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2'>
          <div className='flex flex-col justify-center px-12 py-8'>
            <RegistrationForm />

            <div className='flex items-center justify-center mt-6 text-sm'>
              <p className='text-gray-600'>
                Bạn đã có tài khoản?
                <span
                  onClick={() =>
                    navigate('/home', {
                      state: { modal: 'login' },
                      replace: true,
                    })
                  }
                  className='ml-2 text-red-600 hover:underline font-medium cursor-pointer'
                >
                  Đăng nhập
                </span>
              </p>
            </div>
          </div>

          {/* Right - Social */}
          <div className='flex flex-col justify-center px-12 py-8 bg-gray-50 border-l border-gray-200'>
            <div className='w-full max-w-[320px] mx-auto flex flex-col justify-center h-full'>
              <p className='text-gray-600 text-base text-center mb-4'>
                Hoặc đăng ký bằng
              </p>
              <SocialLogin actionType='register' />
            </div>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
}

export default RegistrationModal;
