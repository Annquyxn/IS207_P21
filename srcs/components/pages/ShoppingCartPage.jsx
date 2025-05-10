import Header from '../header/Header';
import Footer from '../footer/Footer';
import CartHeader from '../cart/CartHeader/CartHeader';
import CheckoutProgress from '../cart/CheckoutProgress/CheckoutProgress';
import EmptyCart from '../cart/EmptyCart/EmptyCart';
import styles from './ShoppingCartPage.module.css';

const ShoppingCartPage = () => (
  <main className={styles.shoppingCart}>
    <Header />
    
    <section className={styles.cartContent}>
      <CartHeader count={0} />
      <CheckoutProgress currentStep={0} />
      <EmptyCart />
    </section>

    <Footer />
  </main>
);

export default ShoppingCartPage;