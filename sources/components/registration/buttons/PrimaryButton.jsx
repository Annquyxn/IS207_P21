const PrimaryButton = ({ children, className = '', ...props }) => {
    return (
      <button
        className={`bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  };
  
export default PrimaryButton;