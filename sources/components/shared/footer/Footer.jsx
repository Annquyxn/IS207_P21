import React from 'react';
import FooterSection from './FooterSection';
import SupportSection from './SupportSection';
import ShippingSection from './ShippingSection';

const Footer = () => (
  <footer className="page-footer">
    <div className="footer-content">
      <div className="footer-sections">
        <FooterSection title="VỀ CHÚNG TÔI" links={["Giới thiệu", "Tuyển dụng", "Liên hệ"]} />
        <FooterSection title="CHÍNH SÁCH" links={["Chính sách bảo hành", "Chính sách giao hàng", "Chính sách bảo mật"]} />
        <FooterSection title="THÔNG TIN" links={["Hệ thống cửa hàng", "Hướng dẫn mua hàng", "Hướng dẫn thanh toán", "Hướng dẫn trả góp", "Tra cứu địa chỉ bảo hành"]} />

        <SupportSection />
        <ShippingSection />
      </div>

      <div className="social-connect">
        <h2 className="connect-heading">KẾT NỐI VỚI CHÚNG TÔI</h2>
        <div className="social-icons">
          {["69cd012b8ed9", "225a7c547129", "98039cfa8f96", "e9a6ad446e9e"].map((id, index) => (
            <a key={index} href="#" className="social-link">
              <img
                src={`https://cdn.builder.io/api/v1/image/assets/TEMP/${id}?placeholderIfAbsent=true&apiKey=a16e8eb3709343e59b0b1c1997d522b7`}
                className="social-media-icon"
                alt="Social media"
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
