import LoginForm from "@/components/features/auth/LoginForm"; // kiểm tra đường dẫn đúng!

function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <LoginForm />
    </div>
  );
}

export default LoginPage;
