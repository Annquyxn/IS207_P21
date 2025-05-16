import RegistrationForm from "@/components/features/auth/RegistrationForm";
import SocialLogin from "@/components/features/auth/SocialLogin";

function RegistrationPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-5 rounded-xl shadow-md w-full max-w-md m-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 text-center">
          Đăng ký tài khoản
        </h1>

        <RegistrationForm />

        <div className="flex items-center justify-center mt-6 text-sm">
          <p className="text-gray-600">Bạn đã có tài khoản?</p>
          <a
            href="/login"
            className="ml-2 text-blue-600 hover:text-blue-800 hover:underline font-medium"
          >
            Đăng nhập
          </a>
        </div>

        <div className="flex items-center my-8 w-full text-sm text-gray-600 gap-2">
          <hr className="flex-1 h-px bg-gray-300" />
          <span className="whitespace-nowrap">HOẶC</span>
          <hr className="flex-1 h-px bg-gray-300" />
        </div>

        <SocialLogin actionType="register" />
      </div>
    </main>
  );
}

export default RegistrationPage;
