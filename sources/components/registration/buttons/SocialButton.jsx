const SocialButton = ({ provider, children }) => {
    const baseClasses = "flex items-center justify-center w-full py-2 px-4 rounded font-medium";
    
    const providerClasses = {
      google: "bg-white text-black border border-gray-300",
      facebook: "bg-blue-600 text-white",
      apple: "bg-black text-white"
    };
  
    return (
      <button className={`${baseClasses} ${providerClasses[provider]}`}>
        <span className="mr-2">{/* Icon placeholder */}</span>
        {children}
      </button>
    );
  };
  
  export default SocialButton;