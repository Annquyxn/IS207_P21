import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AnimatedDiv from '@/components/ui/AnimatedDiv';
import AnimatedButton from '@/components/ui/AnimatedButton';
import SocialLogin from '@/components/ui/SocialLogin';
import { useLoginFormLogic } from './useFormLogic';

function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, errors, onSubmit, isLoading } =
    useLoginFormLogic();

  return (
    <AnimatedDiv className='max-w-md mx-auto bg-white px-6 py-10 rounded-2xl shadow-lg mt-10 relative'>
      <AnimatedDiv className='text-4xl font-extrabold text-center mb-8 text-gray-900'>
        Đăng Nhập
      </AnimatedDiv>

      <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
        <AnimatedDiv>
          <input
            type='text'
            placeholder='Email hoặc Số điện thoại'
            className='w-full px-4 py-3 border rounded-lg text-lg focus:ring-2 focus:ring-red-500'
            {...register('username', {
              required: 'Vui lòng nhập email hoặc số điện thoại',
            })}
          />
          {errors.username && (
            <p className='text-red-500 text-sm mt-1'>
              {errors.username.message}
            </p>
          )}
        </AnimatedDiv>

        <AnimatedDiv className='relative'>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder='Mật khẩu'
            className='w-full px-4 py-3 border rounded-lg pr-12 text-lg focus:ring-2 focus:ring-red-500'
            {...register('password', { required: 'Vui lòng nhập mật khẩu' })}
          />
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='absolute right-3 top-3 text-sm text-gray-600'
          >
            {showPassword ? 'Ẩn' : 'Hiện'}
          </button>
          {errors.password && (
            <p className='text-red-500 text-sm mt-1'>
              {errors.password.message}
            </p>
          )}
        </AnimatedDiv>

        <div className='flex justify-between text-sm text-red-600'>
          <span
            onClick={() =>
              navigate('/home', { state: { modal: 'forgot-password' } })
            }
            className='hover:underline cursor-pointer'
          >
            Quên mật khẩu?
          </span>
          <span
            onClick={() => navigate('/home', { state: { modal: 'register' } })}
            className='hover:underline cursor-pointer'
          >
            Đăng ký
          </span>
        </div>

        <AnimatedButton
          type='submit'
          className='w-full py-3 bg-red-600 text-white text-lg font-semibold rounded-lg hover:bg-red-700'
          disabled={isLoading}
        >
          {isLoading ? (
            <div className='w-6 h-6 border-4 border-white rounded-full animate-spin'></div>
          ) : (
            'Đăng nhập'
          )}
        </AnimatedButton>
      </form>

      <div className='my-6 flex items-center gap-4'>
        <hr className='flex-grow border-gray-300' />
        <span className='text-gray-500 text-sm'>Hoặc đăng nhập bằng</span>
        <hr className='flex-grow border-gray-300' />
      </div>
      <SocialLogin />
    </AnimatedDiv>
  );
}

export default LoginForm;
