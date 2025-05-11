const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  icon,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variantStyles = {
    primary: "bg-black text-white hover:bg-gray-800 focus-visible:ring-black",
    secondary: "bg-white text-black border border-gray-300 hover:bg-gray-50 focus-visible:ring-gray-400",
    danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
    ghost: "text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-300",
    link: "text-black underline-offset-4 hover:underline focus-visible:ring-gray-300",
  };
  
  const sizeStyles = {
    small: "px-3 py-1.5 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-6 py-3 text-lg",
  };
  
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]}`}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;