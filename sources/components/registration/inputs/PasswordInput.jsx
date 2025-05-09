import React from "react";

const PasswordInput = ({ placeholder, className = '' }) => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className={`relative ${className}`}>
      <input
        type={showPassword ? 'text' : 'password'}
        placeholder={placeholder}
        className="w-full rounded border border-black bg-white px-3 py-2 font-kdam text-gray-700 pr-10"
      />
      <button
        type="button"
        className="absolute right-3 top-1/2 transform -translate-y-1/2"
        onClick={() => setShowPassword(!showPassword)}
      >
        👁️
      </button>
    </div>
  );
};

export default PasswordInput;