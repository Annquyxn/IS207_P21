import AnimatedDiv from './AnimatedDiv';
import AnimatedButton from './AnimatedButton';

function SocialLogin({ actionType }) {
  return (
    <AnimatedDiv className='w-full max-w-[400px] space-y-4' delay={0.5}>
      <AnimatedButton
        className='w-full flex items-center justify-center gap-3 py-2 px-5 border rounded-xl bg-white hover:bg-gray-100 hover:scale-105 '
        delay={0.5}
      >
        <img src='/google.svg' className='w-6 h-6' alt='Google' />
        <span className='text-lg font-semibold text-gray-800'>
          {actionType === 'register'
            ? 'Đăng ký bằng Google'
            : 'Đăng nhập bằng Google'}
        </span>
      </AnimatedButton>

      <AnimatedButton
        className='w-full flex items-center justify-center gap-3 py-2 px-5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:scale-105 '
        delay={0.6}
      >
        <img src='/facebook.svg' className='w-6 h-6' alt='Facebook' />
        <span className='text-lg font-semibold'>
          {actionType === 'register'
            ? 'Đăng ký bằng Facebook'
            : 'Đăng nhập bằng Facebook'}
        </span>
      </AnimatedButton>

      <AnimatedButton
        className='w-full flex items-center justify-center gap-3 py-2 px-5 border border-black rounded-lg bg-white hover:bg-gray-100 hover:scale-105 '
        delay={0.6}
      >
        <img src='/github.svg' className='w-6 h-6' alt='Github' />
        <span className='text-lg font-semibold text-black'>
          {actionType === 'register'
            ? 'Đăng ký bằng Github'
            : 'Đăng nhập bằng Github'}
        </span>
      </AnimatedButton>
    </AnimatedDiv>
  );
}

export default SocialLogin;
