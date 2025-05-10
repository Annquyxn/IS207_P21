import Header from "../header/Header";
import Footer from "../footer/Footer";
import RegistrationForm from "../features/auth/RegistrationForm/RegistrationForm";
import SocialLogin from "../features/auth/SocialLogin/SocialLogin";
import styles from "./RegistrationPage.module.css";

const RegistrationPage = () => {
  return (
    <main className={styles.registrationPage}>
      <Header />

      <h1 className={styles.registrationTitle}>Đăng ký tài khoản</h1>

      <RegistrationForm />

      <div className={styles.loginPrompt}>
        <p className={styles.loginText}>Bạn đã có tài khoản?</p>
        <a href="/login" className={styles.loginLink}>
          Đăng nhập
        </a>
      </div>

      <div className={styles.divider}>
        <hr className={styles.dividerLine} />
        <span className={styles.dividerText}>HOẶC</span>
        <hr className={styles.dividerLine} />
      </div>

      <SocialLogin actionType="register" />

      <Footer />
    </main>
  );
};

export default RegistrationPage;
