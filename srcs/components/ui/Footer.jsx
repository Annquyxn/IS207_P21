import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-700 py-12 px-6 text-sm md:text-base">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        {/* VỀ CHÚNG TÔI */}
        <section>
          <h3 className="font-semibold text-gray-900 mb-4">VỀ CHÚNG TÔI</h3>
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="block px-3 py-1 rounded-md hover:bg-red-600 hover:text-white transition"
              >
                Giới thiệu
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block px-3 py-1 rounded-md hover:bg-red-600 hover:text-white transition"
              >
                Tuyển dụng
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block px-3 py-1 rounded-md hover:bg-red-600 hover:text-white transition"
              >
                Liên hệ
              </a>
            </li>
          </ul>
        </section>

        {/* CHÍNH SÁCH */}
        <section>
          <h3 className="font-semibold text-gray-900 mb-4">CHÍNH SÁCH</h3>
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="block px-3 py-1 rounded-md hover:bg-red-600 hover:text-white transition"
              >
                Chính sách bảo hành
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block px-3 py-1 rounded-md hover:bg-red-600 hover:text-white transition"
              >
                Chính sách giao hàng
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block px-3 py-1 rounded-md hover:bg-red-600 hover:text-white transition"
              >
                Chính sách bảo mật
              </a>
            </li>
          </ul>
        </section>

        {/* THÔNG TIN */}
        <section>
          <h3 className="font-semibold text-gray-900 mb-4">THÔNG TIN</h3>
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="block px-3 py-1 rounded-md hover:bg-red-600 hover:text-white transition"
              >
                Hệ thống cửa hàng
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block px-3 py-1 rounded-md hover:bg-red-600 hover:text-white transition"
              >
                Hướng dẫn mua hàng
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block px-3 py-1 rounded-md hover:bg-red-600 hover:text-white transition"
              >
                Hướng dẫn thanh toán
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block px-3 py-1 rounded-md hover:bg-red-600 hover:text-white transition"
              >
                Hướng dẫn trả góp
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block px-3 py-1 rounded-md hover:bg-red-600 hover:text-white transition"
              >
                Tra cứu địa chỉ bảo hành
              </a>
            </li>
          </ul>
        </section>

        {/* TỔNG ĐÀI */}
        <section>
          <h3 className="font-semibold text-gray-900 mb-4">
            TỔNG ĐÀI HỖ TRỢ (8:00 - 21:00)
          </h3>
          <ul className="space-y-1">
            <li>
              <strong>Mua hàng:</strong> 1900 1234
            </li>
            <li>
              <strong>Bảo hành:</strong> 1900 5678
            </li>
            <li>
              <strong>Khiếu nại:</strong> 1900 9999
            </li>
            <li>
              <strong>Email:</strong> support@gearvn.vn
            </li>
          </ul>
        </section>

        {/* VẬN CHUYỂN & THANH TOÁN */}
        <section>
          <h3 className="font-semibold text-gray-900 mb-4">
            ĐƠN VỊ VẬN CHUYỂN
          </h3>
          <p className="text-gray-500 text-sm mb-5">
            Giao hàng nhanh, an toàn, đúng hẹn.
          </p>
          <h3 className="font-semibold text-gray-900 mb-3">
            CÁCH THỨC THANH TOÁN
          </h3>
          <p className="text-gray-500 text-sm">
            COD / Visa / Momo / Chuyển khoản
          </p>
        </section>
      </div>

      {/* SOCIAL */}
      <div className="mt-12 border-t border-gray-300 pt-6 text-center">
        <h3 className="font-semibold text-gray-900 mb-4">
          KẾT NỐI VỚI CHÚNG TÔI
        </h3>
        <div className="flex justify-center gap-4 text-lg">
          <a
            href="#"
            className="bg-gray-200 hover:bg-blue-600 hover:text-white p-2 rounded-full transition"
          >
            <FaFacebookF />
          </a>
          <a
            href="#"
            className="bg-gray-200 hover:bg-sky-400 hover:text-white p-2 rounded-full transition"
          >
            <FaTwitter />
          </a>
          <a
            href="#"
            className="bg-gray-200 hover:bg-pink-500 hover:text-white p-2 rounded-full transition"
          >
            <FaInstagram />
          </a>
          <a
            href="#"
            className="bg-gray-200 hover:bg-red-600 hover:text-white p-2 rounded-full transition"
          >
            <FaYoutube />
          </a>
        </div>
        <p className="text-xs text-gray-500 mt-4">
          © {new Date().getFullYear()} GearVN - All rights reserved
        </p>
      </div>
    </footer>
  );
}

export default Footer;
