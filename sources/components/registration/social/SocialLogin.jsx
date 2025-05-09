import React from 'react';
import SocialButton from './SocialButton';

const SocialLogin = () => (
  <section className="social-login">
    <SocialButton
      className="google-button"
      imgSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/cc71ae39efc0a2a653ee97beaf64867d6699ab7c?placeholderIfAbsent=true&apiKey=a16e8eb3709343e59b0b1c1997d522b7"
      text="Đăng ký bằng Google"
      alt="Google icon"
    />
    <SocialButton
      className="facebook-button"
      imgSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/690f444309c794fd00fbb13897b9f438eadf99cb?placeholderIfAbsent=true&apiKey=a16e8eb3709343e59b0b1c1997d522b7"
      text="Đăng ký bằng Facebook"
      alt="Facebook icon"
    />
  </section>
);

export default SocialLogin;