import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import CartHeader from '@/components/cart/CartHeader';
import CheckoutProgress from '@/components/cart/CheckoutProgress';
import EmptyCart from '@/components/cart/EmptyCart';
import CartItem from '@/components/cart/CartItem';
import { FiArrowRight, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '@/utils/CartContext';

const ShoppingCartPage = () => {
  const navigate = useNavigate();
  const { cart, isLoading, removeFromCart, updateQuantity } = useCart();

  // Format price for display
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫';
  };

  // Calculate cart totals
  const calculateTotals = () => {
    const subtotal = cart.reduce((total, item) => {
      const price =
        typeof item.price === 'string'
          ? parseInt(item.price.replace(/[^\d]/g, ''))
          : item.price;
      return total + price * item.quantity;
    }, 0);

    // Apply shipping logic (free over 500,000₫)
    const shipping = subtotal >= 500000 ? 0 : 30000;

    return {
      subtotal,
      shipping,
      total: subtotal + shipping,
    };
  };

  const { subtotal, shipping, total } = calculateTotals();

  // Handle removing item from cart
  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId, ({ removedProduct }) => {
      toast.success(
        `Đã xóa ${removedProduct.name || 'sản phẩm'} khỏi giỏ hàng`
      );
    });
  };

  // Handle updating item quantity
  const handleUpdateQuantity = (itemId, newQuantity) => {
    updateQuantity(itemId, newQuantity);
  };

  // Format cart item for order page
  const prepareProductForOrder = (item) => {
    return {
      id: item.id,
      title: item.name,
      brand: item.brand,
      image: item.image,
      originalPrice: item.originalPrice
        ? formatPrice(item.originalPrice)
        : formatPrice(0),
      salePrice: formatPrice(item.price),
      quantity: item.quantity,
    };
  };

  // Handle checkout button click
  const handleCheckout = () => {
    if (!cart.length) {
      toast.error('Giỏ hàng của bạn đang trống!');
      return;
    }

    const singleProduct =
      cart.length === 1
        ? prepareProductForOrder(cart[0])
        : {
            id: 'multi-' + Date.now(),
            title: `Đơn hàng (${cart.length} sản phẩm)`,
            brand: 'Nhiều thương hiệu',
            image: cart[0].image,
            originalPrice: formatPrice(subtotal + 50000), // Add a markup for original price
            salePrice: formatPrice(total),
            quantity: 1,
          };

    navigate('/order', {
      state: {
        product: singleProduct,
      },
    });

    // Show success notification
    toast.success('Đang tiến hành đặt hàng...', {
      icon: '🛒',
      duration: 2000,
    });
  };

  // Handle continue shopping
  const handleContinueShopping = () => {
    navigate('/home');
  };

  // Handle direct order for a single product
  const handleOrderNow = (itemId) => {
    const item = cart.find((item) => item.id === itemId);
    if (!item) return;

    // Prepare the single product for order
    const product = prepareProductForOrder(item);

    navigate('/order', {
      state: { product },
    });

    toast.success('Đang tiến hành đặt hàng...', {
      icon: '🛒',
      duration: 2000,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='min-h-screen bg-gray-50 flex flex-col items-center justify-start p-4 py-8'
    >
      {/* Cart Section */}
      <section className='w-full max-w-4xl bg-white shadow-lg rounded-2xl p-6 space-y-6'>
        <CartHeader count={cart.length} />
        <CheckoutProgress currentStep={0} />

        {isLoading ? (
          <div className='py-20 flex flex-col items-center justify-center'>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className='w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mb-4'
            />
            <p className='text-gray-500'>Đang tải giỏ hàng...</p>
          </div>
        ) : cart.length === 0 ? (
          <EmptyCart />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Cart Items */}
            <div className='space-y-2 mb-8'>
              <AnimatePresence>
                {cart.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                    className='relative'
                  >
                    <CartItem
                      item={item}
                      onRemove={handleRemoveItem}
                      onUpdateQuantity={handleUpdateQuantity}
                    />
                    {/* Quick actions */}
                    <div className='absolute right-3 -bottom-4 z-10 flex gap-2'>
                      <button
                        onClick={() => handleOrderNow(item.id)}
                        className='text-xs bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600 transition shadow-sm'
                      >
                        Mua ngay
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Cart Summary */}
            <div className='mt-8 border-t pt-6'>
              <div className='bg-gray-50 rounded-xl p-6'>
                <div className='flex justify-between mb-4'>
                  <span className='text-gray-600'>Tạm tính:</span>
                  <span className='font-medium'>{formatPrice(subtotal)}</span>
                </div>

                <div className='flex justify-between mb-4'>
                  <span className='text-gray-600'>Phí vận chuyển:</span>
                  {shipping === 0 ? (
                    <span className='text-green-600 font-medium'>Miễn phí</span>
                  ) : (
                    <span className='font-medium'>{formatPrice(shipping)}</span>
                  )}
                </div>

                <div className='h-px bg-gray-200 my-4'></div>

                <div className='flex justify-between mb-6'>
                  <span className='text-lg font-bold'>Tổng cộng:</span>
                  <span className='text-xl font-bold text-red-600'>
                    {formatPrice(total)}
                  </span>
                </div>

                <div className='flex flex-col sm:flex-row gap-4'>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCheckout}
                    className='flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg'
                  >
                    <span>
                      {cart.length === 1
                        ? 'Đặt hàng ngay'
                        : 'Tiến hành thanh toán'}
                    </span>
                    <FiArrowRight />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleContinueShopping}
                    className='flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-50'
                  >
                    <FiShoppingBag />
                    <span>Tiếp tục mua hàng</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </section>
    </motion.div>
  );
};

export default ShoppingCartPage;
