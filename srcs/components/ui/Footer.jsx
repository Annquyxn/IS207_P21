import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

function Footer() {
  return (
    <footer className='bg-white text-gray-800 py-10 px-6'>
      <div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 text-sm'>
        {/* VỀ CHÚNG TÔI */}
        <section>
          <h3 className='text-base font-semibold mb-3'>VỀ CHÚNG TÔI</h3>
          <ul className='space-y-2'>
            <li>
              <a href='#' className='hover:underline'>
                Giới thiệu
              </a>
            </li>
            <li>
              <a href='#' className='hover:underline'>
                Tuyển dụng
              </a>
            </li>
            <li>
              <a href='#' className='hover:underline'>
                Liên hệ
              </a>
            </li>
          </ul>
        </section>

        {/* CHÍNH SÁCH */}
        <section>
          <h3 className='text-base font-semibold mb-3'>CHÍNH SÁCH</h3>
          <ul className='space-y-2'>
            <li>
              <a href='#' className='hover:underline'>
                Chính sách bảo hành
              </a>
            </li>
            <li>
              <a href='#' className='hover:underline'>
                Chính sách giao hàng
              </a>
            </li>
            <li>
              <a href='#' className='hover:underline'>
                Chính sách bảo mật
              </a>
            </li>
          </ul>
        </section>

        {/* THÔNG TIN */}
        <section>
          <h3 className='text-base font-semibold mb-3'>THÔNG TIN</h3>
          <ul className='space-y-2'>
            <li>
              <a href='#' className='hover:underline'>
                Hệ thống cửa hàng
              </a>
            </li>
            <li>
              <a href='#' className='hover:underline'>
                Hướng dẫn mua hàng
              </a>
            </li>
            <li>
              <a href='#' className='hover:underline'>
                Hướng dẫn thanh toán
              </a>
            </li>
            <li>
              <a href='#' className='hover:underline'>
                Hướng dẫn trả góp
              </a>
            </li>
            <li>
              <a href='#' className='hover:underline'>
                Tra cứu địa chỉ bảo hành
              </a>
            </li>
          </ul>
        </section>

        {/* TỔNG ĐÀI */}
        <section>
          <h3 className='text-base font-semibold mb-3'>
            TỔNG ĐÀI HỖ TRỢ (8:00 - 21:00)
          </h3>
          <ul className='space-y-1'>
            <li>Mua hàng: 1900 1234</li>
            <li>Bảo hành: 1900 5678</li>
            <li>Khiếu nại: 1900 9999</li>
            <li>Email: support@gearvn.vn</li>
          </ul>
        </section>

        {/* VẬN CHUYỂN & THANH TOÁN */}
        <section>
          <h3 className='text-base font-semibold mb-3'>ĐƠN VỊ VẬN CHUYỂN</h3>
          <p className='text-xs text-gray-400'>
            Giao hàng nhanh, an toàn, đúng hẹn.
          </p>
          <h3 className='text-base font-semibold mt-5 mb-3'>
            CÁCH THỨC THANH TOÁN
          </h3>
          <p className='text-xs text-gray-400'>
            COD / Visa / Momo / Chuyển khoản
          </p>
        </section>
      </div>

      {/* SOCIAL */}
      <div className='mt-10 border-t border-gray-700 pt-6 text-center'>
        <h3 className='text-base font-semibold mb-4'>KẾT NỐI VỚI CHÚNG TÔI</h3>
        <div className='flex justify-center gap-4 text-xl'>
          <a href='#' className='hover:text-blue-500'>
            <FaFacebookF />
          </a>
          <a href='#' className='hover:text-sky-400'>
            <FaTwitter />
          </a>
          <a href='#' className='hover:text-pink-500'>
            <FaInstagram />
          </a>
          <a href='#' className='hover:text-red-600'>
            <FaYoutube />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
