import Footer from "@/components/footer/Footer";
import CartHeader from "@/components/cart/CartHeader";
import CheckoutProgress from "@/components/cart/CheckoutProgress";
import EmptyCart from "@/components/cart/EmptyCart";
import RegistrationForm from "@/features/auth/RegistrationForm/RegistrationForm";
import SocialLogin from "@/features/auth/SocialLogin/SocialLogin";
import styles from "@/ShoppingCartPage.module.css";

function ShoppingCartPage() {
  <main className={styles.shoppingCart}>
    <Header />

    <section className={styles.cartContent}>
      <CartHeader count={0} />
      <CheckoutProgress currentStep={0} />
      <EmptyCart />
    </section>

    <Footer />
  </main>;
}

export default ShoppingCartPage;
