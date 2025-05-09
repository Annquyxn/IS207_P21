import React from 'react';

const SubmitButton = ({ text = 'Đăng ký' }) => (
  <button type="submit" className="register-button">
    {text}
  </button>
);

export default SubmitButton;
