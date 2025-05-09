import React from 'react';

const SocialButton = ({ className, imgSrc, text, alt }) => (
  <button className={`social-button ${className}`}>
    <img src={imgSrc} className="social-icon" alt={alt} />
    <span className="social-text">{text}</span>
  </button>
);

export default SocialButton;
