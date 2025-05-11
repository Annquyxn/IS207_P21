function Footer() {
  return (
    <footer className="bg-gray-50 mt-20 py-12 px-8 border-t">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8">
        {/* About Section */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-gray-800">VỀ CHÚNG TÔI</h3>
          <div className="space-y-2">
            <a href="#" className="block text-gray-600 hover:text-red-600">
              Giới thiệu
            </a>
            <a href="#" className="block text-gray-600 hover:text-red-600">
              Tuyển dụng
            </a>
            <a href="#" className="block text-gray-600 hover:text-red-600">
              Liên hệ
            </a>
          </div>
        </div>

        {/* Policy Section */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-gray-800">CHÍNH SÁCH</h3>
          <div className="space-y-2">
            <a href="#" className="block text-gray-600 hover:text-red-600">
              Bảo hành
            </a>
            <a href="#" className="block text-gray-600 hover:text-red-600">
              Giao hàng
            </a>
            <a href="#" className="block text-gray-600 hover:text-red-600">
              Bảo mật
            </a>
          </div>
        </div>

        {/* Payment & Shipping */}
        <div className="col-span-2 md:col-span-1 space-y-6">
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-800">VẬN CHUYỂN</h3>
            <div className="flex gap-3">{/* Shipping icons */}</div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-800">THANH TOÁN</h3>
            <div className="flex gap-3">{/* Payment icons */}</div>
          </div>
        </div>

        {/* Social Connect */}
        <div className="col-span-2 md:col-span-2 space-y-6">
          <h3 className="text-lg font-bold text-gray-800">
            KẾT NỐI VỚI CHÚNG TÔI
          </h3>
          <div className="flex gap-4">{/* Social icons */}</div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
