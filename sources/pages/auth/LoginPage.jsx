// src/pages/auth/LoginPage.jsx
import AuthLayout from '../../components/auth/common/AuthLayout';
import AuthTitle from '../../components/auth/common/AuthTitle';
import LoginForm from '../../components/auth/forms/LoginForm';
import SocialAuth from '../../components/auth/social/SocialAuth';

const LoginPage = () => {
  return (
    <AuthLayout>
      <AuthTitle>Đăng Nhập</AuthTitle>
      <LoginForm />
      
      <div className="text-right mt-2">
        <a href="#" className="text-xs text-black underline">
          Quên mật khẩu?
        </a>
      </div>
      
      <div className="flex items-center my-6">
        <hr className="flex-grow border-gray-300" />
        <span className="px-3 text-gray-600">HOẶC</span>
        <hr className="flex-grow border-gray-300" />
      </div>
      
      <SocialAuth actionText="Đăng nhập" />
      
      <div className="text-center mt-6">
        <span className="text-gray-600">Bạn chưa có tài khoản? </span>
        <a href="/register" className="font-bold text-black underline">
          Đăng ký ngay
        </a>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;