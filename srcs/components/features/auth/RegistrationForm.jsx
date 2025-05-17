import { useState } from 'react';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline';
import Spinner from '@/components/ui/Spinner';
import AnimatedPage from '@/components/ui/AnimatedPage';
import AnimatedDiv from '@/components/ui/AnimatedDiv';
import { useRegisterFormLogic } from './useRegisterFormLogic';

function RegistrationForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, errors, watch, onSubmit, loading } =
    useRegisterFormLogic();

  return (
    <AnimatedPage>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        <AnimatedDiv>
          <input
            type='text'
            placeholder='Họ và Tên'
            className={`w-full px-4 py-3 border text-lg rounded-lg shadow-sm focus:outline-none hover:shadow-md transform hover:scale-[1.01] ${
              errors.fullName
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            {...register('fullName', { required: 'Vui lòng nhập họ và tên' })}
          />
          {errors.fullName && (
            <p className='mt-1 text-sm text-red-600'>
              {errors.fullName.message}
            </p>
          )}
        </AnimatedDiv>

        <AnimatedDiv>
          <input
            type='email'
            placeholder='Email'
            className={`w-full px-4 py-3 border text-lg rounded-lg shadow-sm focus:outline-none hover:shadow-md transform hover:scale-[1.01] ${
              errors.email
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            {...register('email', {
              required: 'Vui lòng nhập email',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Email không hợp lệ',
              },
            })}
          />
          {errors.email && (
            <p className='mt-1 text-sm text-red-600'>{errors.email.message}</p>
          )}
        </AnimatedDiv>

        <AnimatedDiv className='relative'>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder='Mật khẩu'
            className={`w-full px-4 py-3 border text-lg rounded-lg pr-12 shadow-sm focus:outline-none hover:shadow-md transform hover:scale-[1.01] ${
              errors.password
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            {...register('password', {
              required: 'Vui lòng nhập mật khẩu',
              minLength: {
                value: 6,
                message: 'Mật khẩu phải có ít nhất 6 ký tự',
              },
            })}
          />
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='absolute right-3 top-1/2 -translate-y-1/2'
          >
            {showPassword ? (
              <EyeOffIcon className='w-5 h-5 text-gray-500' />
            ) : (
              <EyeIcon className='w-5 h-5 text-gray-500' />
            )}
          </button>
          {errors.password && (
            <p className='mt-1 text-sm text-red-600'>
              {errors.password.message}
            </p>
          )}
        </AnimatedDiv>

        <AnimatedDiv className='relative'>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder='Xác nhận mật khẩu'
            className={`w-full px-4 py-3 border text-lg rounded-lg pr-12 shadow-sm focus:outline-none hover:shadow-md transform hover:scale-[1.01] ${
              errors.confirmPassword
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            {...register('confirmPassword', {
              required: 'Vui lòng xác nhận mật khẩu',
              validate: (value) =>
                value === watch('password') || 'Mật khẩu không khớp',
            })}
          />
          {errors.confirmPassword && (
            <p className='mt-1 text-sm text-red-600'>
              {errors.confirmPassword.message}
            </p>
          )}
        </AnimatedDiv>

        <button
          type='submit'
          disabled={loading}
          className={`w-full py-3 font-bold text-lg bg-red-600 text-white rounded-lg transition-all transform ${
            loading
              ? 'opacity-70 cursor-not-allowed'
              : 'hover:bg-red-700 hover:scale-105'
          }`}
        >
          {loading ? (
            <div className='flex items-center justify-center gap-2'>
              <Spinner className='w-5 h-5' /> Đang đăng ký...
            </div>
          ) : (
            'Đăng ký'
          )}
        </button>
      </form>
    </AnimatedPage>
  );
}

export default RegistrationForm;
