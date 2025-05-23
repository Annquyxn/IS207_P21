import { Link } from "react-router-dom";
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
              <Link
                to="/about"
                className="block px-3 py-1 rounded-md transform transition duration-300 hover:scale-105 hover:bg-red-600 hover:text-white"
              >
                Giới thiệu
              </Link>
            </li>
            <li>
              <Link
                to="/jobs"
                className="block px-3 py-1 rounded-md transform transition duration-300 hover:scale-105 hover:bg-red-600 hover:text-white"
              >
                Tuyển dụng
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="block px-3 py-1 rounded-md transform transition duration-300 hover:scale-105 hover:bg-red-600 hover:text-white"
              >
                Liên hệ
              </Link>
            </li>
          </ul>
        </section>

        {/* CHÍNH SÁCH */}
        <section>
          <h3 className="font-semibold text-gray-900 mb-4">CHÍNH SÁCH</h3>
          <ul className="space-y-2">
            <li>
              <Link
                to="/warranty-policy"
                className="block px-3 py-1 rounded-md transform transition duration-300 hover:scale-105 hover:bg-red-600 hover:text-white"
              >
                Chính sách bảo hành
              </Link>
            </li>
            <li>
              <Link
                to="/shipping-policy"
                className="block px-3 py-1 rounded-md transform transition duration-300 hover:scale-105 hover:bg-red-600 hover:text-white"
              >
                Chính sách giao hàng
              </Link>
            </li>
            <li>
              <Link
                to="/privacy-policy"
                className="block px-3 py-1 rounded-md transform transition duration-300 hover:scale-105 hover:bg-red-600 hover:text-white"
              >
                Chính sách bảo mật
              </Link>
            </li>
          </ul>
        </section>

        {/* THÔNG TIN */}
        <section>
          <h3 className="font-semibold text-gray-900 mb-4">THÔNG TIN</h3>
          <ul className="space-y-2">
            <li>
              <Link
                to="/showrooms"
                className="block px-3 py-1 rounded-md transform transition duration-300 hover:scale-105 hover:bg-red-600 hover:text-white"
              >
                Hệ thống cửa hàng
              </Link>
            </li>
            <li>
              <Link
                to="/shopping-guide"
                className="block px-3 py-1 rounded-md transform transition duration-300 hover:scale-105 hover:bg-red-600 hover:text-white"
              >
                Hướng dẫn mua hàng
              </Link>
            </li>
            <li>
              <Link
                to="/payment-guide"
                className="block px-3 py-1 rounded-md transform transition duration-300 hover:scale-105 hover:bg-red-600 hover:text-white"
              >
                Hướng dẫn thanh toán
              </Link>
            </li>
            <li>
              <Link
                to="/installment"
                className="block px-3 py-1 rounded-md transform transition duration-300 hover:scale-105 hover:bg-red-600 hover:text-white"
              >
                Hướng dẫn trả góp
              </Link>
            </li>
            <li>
              <Link
                to="/warranty-lookup"
                className="block px-3 py-1 rounded-md transform transition duration-300 hover:scale-105 hover:bg-red-600 hover:text-white"
              >
                Tra cứu địa chỉ bảo hành
              </Link>
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
          {[
            { icon: FaFacebookF, color: "hover:bg-[#1877F2]" },
            { icon: FaTwitter, color: "hover:bg-[#1DA1F2]" },
            {
              icon: FaInstagram,
              color:
                "hover:bg-gradient-to-br hover:from-pink-500 hover:to-yellow-500",
            },
            { icon: FaYoutube, color: "hover:bg-[#FF0000]" },
          ].map((item, index) => (
            <a
              key={index}
              href="#"
              className={`bg-gray-200 p-2 rounded-full transform transition duration-300 hover:scale-110 hover:text-white ${item.color}`}
            >
              <item.icon />
            </a>
          ))}
        </div>

        <p className="text-xs text-gray-500 mt-4">
          © {new Date().getFullYear()} GearVN - All rights reserved
        </p>
      </div>
    </footer>
  );
}

export default Footer;
