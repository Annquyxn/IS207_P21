import Header from '../components/Header/Header';
import CartHeader from '../components/Cart/CartHeader';
import CheckoutProgress from '../components/Cart/CheckoutProgress';
import EmptyCart from '../components/Cart/EmptyCart';
import FeaturedProducts from '../components/FeaturedProducts/FeaturedProducts';
import Footer from '../components/Footer/Footer';

export default function ShoppingCartPage() {
  return (
    <main className="shopping-cart">
      <Header />
      
      <section className="cart-content">
        <CartHeader count={0} />
        <CheckoutProgress currentStep={0} />
        <EmptyCart />
      </section>

      <FeaturedProducts />
      <Footer />
    </main>
  );
}