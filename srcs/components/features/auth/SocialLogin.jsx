function SocialLogin() {
  return (
    <div className="w-full max-w-[400px] space-y-3">
      <button className="w-full flex items-center justify-center gap-3 py-2 px-4 border rounded-lg hover:bg-gray-50">
        <img src="/google-icon.svg" className="w-6 h-6" alt="Google" />
        <span>Đăng ký bằng Google</span>
      </button>

      <button className="w-full flex items-center justify-center gap-3 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        <img src="/facebook-icon.svg" className="w-6 h-6" alt="Facebook" />
        <span>Đăng ký bằng Facebook</span>
      </button>
    </div>
  );
}

export default SocialLogin;
