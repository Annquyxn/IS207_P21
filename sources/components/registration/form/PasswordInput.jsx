import React from 'react';

const PasswordInput = ({ placeholder }) => (
  <div className="password-container">
    <input
      type="password"
      className="password-input"
      placeholder={placeholder}
    />
    <img
      src="https://cdn.builder.io/api/v1/image/assets/TEMP/0fbcc5f65f79e05ddcbca865c823c24f2a1fc835?placeholderIfAbsent=true&apiKey=a16e8eb3709343e59b0b1c1997d522b7"
      className="password-toggle"
      alt="Toggle password visibility"
    />
  </div>
);

export default PasswordInput;
