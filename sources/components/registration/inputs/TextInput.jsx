const TextInput = ({ placeholder, className = '', ...props }) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      className={`w-full rounded border border-black bg-white px-3 py-2 font-kdam text-gray-700 ${className}`}
      {...props}
    />
  );
};

export default TextInput;