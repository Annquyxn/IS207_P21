import { useState } from 'react';
import Button from '../../../ui/Button/Button';
import Input from '../../../ui/Input/Input';
import SocialLogin from '../SocialLogin/SocialLogin';
import styles from './RegistrationForm.module.css';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form className={styles.registrationForm} onSubmit={handleSubmit}>
      <Input
        name="fullName"
        placeholder="Họ và Tên"
        value={formData.fullName}
        onChange={handleChange}
        className={styles.inputField}
      />
      
      <Input
        name="email"
        placeholder="Email hoặc Số điện thoại"
        value={formData.email}
        onChange={handleChange}
        className={styles.inputField}
      />

      <div className={styles.passwordContainer}>
        <Input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Mật khẩu"
          value={formData.password}
          onChange={handleChange}
          className={styles.passwordInput}
        />
        <img 
          src="/eye-icon.svg" 
          onClick={() => setShowPassword(!showPassword)}
          className={styles.passwordToggle}
          alt="Toggle password"
        />
      </div>

      <div className={styles.passwordContainer}>
        <Input
          type={showPassword ? "text" : "password"}
          name="confirmPassword"
          placeholder="Nhập lại mật khẩu"
          value={formData.confirmPassword}
          onChange={handleChange}
          className={styles.passwordInput}
        />
        <img 
          src="/eye-icon.svg" 
          onClick={() => setShowPassword(!showPassword)}
          className={styles.passwordToggle}
          alt="Toggle password"
        />
      </div>

      <Button type="submit" variant="danger" className={styles.registerButton}>
        Đăng ký
      </Button>
    </form>
  );
};

export default RegistrationForm;