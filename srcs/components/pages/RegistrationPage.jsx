import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import RegistrationForm from "@/features/auth/RegistrationForm";
import SocialLogin from "@/features/auth/SocialLogin";

function RegistrationPage() {
  return (
    <main className="bg-white flex flex-col items-center py-16 min-h-screen">
      <Header />

      <h1 className="text-[28px] font-bold text-[#333] mb-8 font-['Familjen_Grotesk']">
        Đăng ký tài khoản
      </h1>

      <RegistrationForm />

      <div className="flex items-center justify-center mt-6 text-sm">
        <p className="text-gray-700 text-base font-medium">Bạn đã có tài khoản?</p>
        <a href="/login" className="ml-2 text-blue-600 font-semibold text-lg hover:underline">
          Đăng nhập
        </a>
      </div>

      <div className="flex items-center my-8 w-full max-w-md text-sm text-gray-600 gap-2">
        <hr className="flex-1 h-px bg-gray-300" />
        <span className="whitespace-nowrap">HOẶC</span>
        <hr className="flex-1 h-px bg-gray-300" />
      </div>

      <SocialLogin actionType="register" />

      <Footer />
    </main>
  );
};

export default RegistrationPage;
