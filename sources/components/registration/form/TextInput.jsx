import React from 'react';

const TextInput = ({ placeholder, className = '' }) => (
  <input
    type="text"
    className={`input-field ${className}`.trim()}
    placeholder={placeholder}
  />
);

export default TextInput;
