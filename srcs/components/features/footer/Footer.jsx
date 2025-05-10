import styles from './Footer.module.css';

const Footer = () => (
  <footer className={styles.siteFooter}>
    <div className={styles.footerContainer}>
      <div className={styles.footerSections}>
        {/* Các section footer */}
        <section className={styles.footerSection}>
          <h3>VỀ CHÚNG TÔI</h3>
          <nav className={styles.footerLinks}>
            <a href="#">Giới thiệu</a>
            <a href="#">Tuyển dụng</a>
            <a href="#">Liên hệ</a>
          </nav>
        </section>
        
        {/* Các section khác */}
      </div>
      
      <div className={styles.socialConnect}>
        <h3>KẾT NỐI VỚI CHÚNG TÔI</h3>
        <div className={styles.socialIcons}>
          {/* Social icons */}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;