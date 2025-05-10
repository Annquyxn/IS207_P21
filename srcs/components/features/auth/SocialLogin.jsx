import Button from "../../../ui/Button/Button";
import styles from "./SocialLogin.module.css";

const SocialLogin = ({ actionType = "login" }) => {
  const actionText = actionType === "login" ? "Đăng nhập" : "Đăng ký";

  return (
    <section className={styles.socialLogin}>
      <Button variant="outline" className={styles.googleButton}>
        <img
          src="/google-icon.svg"
          alt="Google"
          className={styles.socialIcon}
        />
        <span className={styles.socialText}>{actionText} bằng Google</span>
      </Button>

      <Button variant="primary" className={styles.facebookButton}>
        <img
          src="/facebook-icon.svg"
          alt="Facebook"
          className={styles.socialIcon}
        />
        <span className={styles.socialText}>{actionText} bằng Facebook</span>
      </Button>

      <Button variant="outline" className={styles.appleButton}>
        <img src="/apple-icon.svg" alt="Apple" className={styles.socialIcon} />
        <span className={styles.socialText}>{actionText} bằng Apple</span>
      </Button>
    </section>
  );
};

export default SocialLogin;
