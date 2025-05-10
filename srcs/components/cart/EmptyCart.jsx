import styles from './Cart.module.css';

export default function EmptyCart() {
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