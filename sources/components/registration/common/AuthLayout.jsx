// src/components/auth/common/AuthLayout.jsx
const AuthLayout = ({ children }) => {
  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-10 flex flex-col items-center">
      <div className="w-full max-w-md px-4">
        {children}
      </div>
    </main>
  );
};

export default AuthLayout;