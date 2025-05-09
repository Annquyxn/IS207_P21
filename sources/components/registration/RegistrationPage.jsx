// src/components/registration/RegistrationPage.jsx
import React from 'react';
import Title from './common/Title';
import RegistrationForm from './form/RegistrationForm';
import LoginPrompt from './common/LoginPrompt';
import Divider from './common/Divider';
import SocialLogin from './social/SocialLogin';
import Footer from './footer/Footer';
import '../../../styles/registration-page.css';

const RegistrationPage = () => {
  return (
    <main className="registration-page">
      <Title text="Đăng ký tài khoản" />

      <RegistrationForm />

      <LoginPrompt 
        text="Bạn đã có tài khoản?"
        linkText="Đăng nhập"
      />

      <Divider text="HOẶC" />

      <SocialLogin />

      <Footer />
    </main>
  );
};

export default RegistrationPage;