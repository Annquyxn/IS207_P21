// src/components/auth/forms/LoginForm.jsx
import TextInput from '../inputs/TextInput';
import PasswordInput from '../inputs/PasswordInput';
import PrimaryButton from '../buttons/PrimaryButton';

const LoginForm = () => {
  return (
    <form className="space-y-4">
      <TextInput placeholder="Email hoặc Số điện thoại" />
      <PasswordInput placeholder="Mật khẩu" />
      <PrimaryButton className="w-full">
        Đăng nhập
      </PrimaryButton>
    </form>
  );
};

export default LoginForm;