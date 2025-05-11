export default function LoginForm() {
  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md">
      <h1 className="text-3xl font-bold text-center mb-8">Đăng Nhập</h1>
      
      <form className="space-y-6">
        <div>
          <input
            type="text"
            placeholder="Email hoặc Số điện thoại"
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div className="relative">
          <input
            type="password"
            placeholder="Mật khẩu"
            className="w-full px-4 py-3 border rounded-lg pr-12"
          />
          <button className="absolute right-3 top-3 text-gray-500">
            {/* Eye icon */}
          </button>
        </div>

        <a href="#" className="block text-right text-sm text-red-600 hover:underline">
          Quên mật khẩu?
        </a>

        <button className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
          Đăng nhập
        </button>
      </form>

      <div className="my-6 flex items-center gap-4">
        <hr className="flex-grow border-gray-300" />
        <span className="text-gray-500">Hoặc đăng nhập bằng</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      <div className="space-y-4">
        <button className="w-full flex items-center justify-center gap-2 py-2 border rounded-lg hover:bg-gray-50">
          <img src="/google-icon.svg" className="w-6 h-6" alt="Google" />
          <span>Google</span>
        </button>
        
        <button className="w-full flex items-center justify-center gap-2 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <img src="/facebook-icon.svg" className="w-6 h-6" alt="Facebook" />
          <span>Facebook</span>
        </button>
      </div>
    </div>
  )
}