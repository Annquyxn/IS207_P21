import CartHeader from '@/components/cart/CartHeader';
import CheckoutProgress from '@/components/cart/CheckoutProgress';
import EmptyCart from '@/components/cart/EmptyCart';

const ShoppingCartPage = () => (
  <main className='min-h-screen bg-gray-50 flex flex-col items-center justify-start p-4'>
    {/* Cart Section */}
    <section className='w-full max-w-4xl bg-white shadow-lg rounded-2xl p-6 space-y-6'>
      <CartHeader count={0} />
      <CheckoutProgress currentStep={0} />
      <EmptyCart />
    </section>
  </main>
);

export default ShoppingCartPage;
