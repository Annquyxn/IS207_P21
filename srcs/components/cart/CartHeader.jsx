import styles from './Cart.module.css';

export default function CartHeader({ count }) {
  return (
    <header className={styles.cartHeader}>
      <Icon name="cart-outline" className={styles.cartHeaderIcon} />
      <h1 className={styles.cartTitle}>
        Giỏ hàng của bạn <span>({count} sản phẩm)</span>
      </h1>
    </header>
  );
}