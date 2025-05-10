import styles from "./Cart.module.css";

const steps = [
  { icon: "cart", label: "Giỏ hàng" },
  { icon: "card", label: "Thông tin" },
  { icon: "cash", label: "Thanh toán" },
  { icon: "briefcase", label: "Hoàn tất" },
];

function CheckoutProgress({ currentStep }) {
  return (
    <div className={styles.checkoutProgress}>
      <div className={styles.progressContainer}>
        {steps.map((step, index) => (
          <div
            className={`${styles.step} ${
              index <= currentStep ? styles.active : ""
            }`}
            key={step.label}
          >
            <div className={styles.icon}>
              <Icon name={step.icon} />
            </div>
            {index !== steps.length - 1 && <div className={styles.line} />}
            <div>{step.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CheckoutProgress;
