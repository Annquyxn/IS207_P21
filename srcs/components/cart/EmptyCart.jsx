import styles from "./Cart.module.css";

function EmptyCart() {
  return (
    <div className={styles.emptyCartContainer}>
      <div className={styles.emptyCartContent}>
        <p>Giỏ hàng của bạn đang trống!</p>
        <Button icon="bag" href="#">
          Mua hàng
        </Button>
      </div>
    </div>
  );
}

export default EmptyCart;
