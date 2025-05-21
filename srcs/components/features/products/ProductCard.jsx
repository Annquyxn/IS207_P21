import { useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiZap, FiStar } from 'react-icons/fi';
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useCart } from '@/utils/CartContext';

const ProductCard = ({
  id,
  title,
  brand,
  image,
  originalPrice,
  salePrice,
  discount,
  rating,
  reviewCount,
}) => {
  const navigate = useNavigate();
  const [showCheckoutOptions, setShowCheckoutOptions] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const { addToCart } = useCart();

  // Clear the "added to cart" state after a delay
  useEffect(() => {
    if (isAddedToCart) {
      const timer = setTimeout(() => {
        setShowCheckoutOptions(false);
        setIsAddedToCart(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isAddedToCart]);

  const handleNavigate = () => {
    navigate(`/product/${id}`);
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    const formattedProduct = {
      id,
      title,
      brand,
      image,
      originalPrice,
      salePrice,
      discount,
      quantity: 1,
    };

    navigate('/order', {
      state: {
        product: formattedProduct,
      },
    });
  };

  // Memoize the add to cart handler to avoid recreation on each render
  const handleAddToCart = useCallback(
    (e) => {
      e.stopPropagation();

      // Prepare product data
      const productData = {
        id,
        name: title,
        price: parseInt(salePrice.replace(/[^\d]/g, '')),
        originalPrice: originalPrice
          ? parseInt(originalPrice.replace(/[^\d]/g, ''))
          : null,
        image,
        brand,
        sku: `SKU${id}`,
      };

      // Add to cart using the mutation pattern from useCart
      addToCart(productData, (result) => {
        // Show success notification based on the action (add or update)
        if (result.action === 'add') {
          toast.success(`Đã thêm ${title} vào giỏ hàng!`);
        } else {
          toast.success(`Đã cập nhật số lượng ${title} trong giỏ hàng!`);
        }

        // Set state outside of render
        setIsAddedToCart(true);
        // setShowCheckoutOptions(true);
      });
    },
    [id, title, salePrice, originalPrice, image, brand, addToCart]
  );

  const calculateDiscountPercentage = () => {
    try {
      const original = originalPrice
        ? parseInt(originalPrice.replace(/[^\d]/g, ''))
        : 0;
      const sale = salePrice ? parseInt(salePrice.replace(/[^\d]/g, '')) : 0;

      if (original === 0 || original <= sale) {
        return discount ? parseInt(discount.replace(/[^\d%]/g, '')) : 0;
      }

      const percentage = Math.round(((original - sale) / original) * 100);
      return percentage > 0 ? percentage : 0;
    } catch (error) {
      console.error('Error calculating discount:', error);
      return discount ? parseInt(discount.replace(/[^\d%]/g, '')) : 0;
    }
  };

  const formatPrice = (price) => {
    if (!price) return '0₫';
    try {
      const numericPrice = parseInt(price.replace(/[^\d]/g, ''));
      return numericPrice.toLocaleString('vi-VN') + '₫';
    } catch {
      return price;
    }
  };

  const imageUrl =
    image && image.trim()
      ? image
      : 'https://via.placeholder.com/300x200?text=No+Image';

  const discountPercentage = calculateDiscountPercentage();
  const formattedSalePrice = salePrice ? formatPrice(salePrice) : '0₫';
  const formattedOriginalPrice = originalPrice
    ? formatPrice(originalPrice)
    : '0₫';

  // Handle checkout directly from the toast notification
  const handleDirectCheckout = useCallback(
    (e) => {
      e.stopPropagation();
      // Get current cart from localStorage
      const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');

      // If there's only one item, go directly to order
      if (cartItems.length === 1) {
        const formattedProduct = {
          id: cartItems[0].id,
          title: cartItems[0].name,
          brand: cartItems[0].brand,
          image: cartItems[0].image,
          originalPrice: cartItems[0].originalPrice
            ? formatPrice(cartItems[0].originalPrice)
            : formatPrice(0),
          salePrice: formatPrice(cartItems[0].price),
          quantity: cartItems[0].quantity,
        };

        navigate('/order', {
          state: {
            product: formattedProduct,
          },
        });

        toast.success('Đang tiến hành đặt hàng...', {
          icon: '🛒',
          duration: 2000,
        });
      } else {
        // If there are multiple items, go to shopping cart
        navigate('/shopping-cart');
      }

      // Hide checkout options
      setShowCheckoutOptions(false);
    },
    [navigate]
  );

  // Handle continue shopping
  const handleContinueShopping = useCallback((e) => {
    e.stopPropagation();
    setShowCheckoutOptions(false);
  }, []);

  return (
    <div
      onClick={handleNavigate}
      className='relative bg-white p-4 rounded-2xl flex flex-col justify-between h-full transition-transform duration-300 cursor-pointer shadow hover:shadow-lg'
    >
      <div className='relative'>
        <img
          src={imageUrl}
          alt={title}
          className='w-full h-[180px] object-contain mb-3 rounded-lg bg-gray-50'
        />
        {(discountPercentage > 0 || discount) && (
          <div className='absolute top-2 right-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded'>
            -{discountPercentage || discount.replace(/[^\d]/g, '') || 0}%
          </div>
        )}
      </div>

      <h3 className='text-sm font-semibold text-gray-800 line-clamp-2 mb-1'>
        {title}
      </h3>
      <p className='text-xs text-gray-500 mb-1'>{brand}</p>

      <div className='flex items-center gap-2 text-sm font-medium text-red-600 mb-1'>
        {formattedSalePrice}
        <span className='line-through text-xs text-gray-400'>
          {formattedOriginalPrice}
        </span>
      </div>

      <div className='flex justify-between items-center my-2 text-xs'>
        <span className='text-yellow-500 font-medium flex items-center gap-1'>
          <FiStar className='w-3 h-3' /> {rating}
        </span>
        <span className='text-gray-500'>{reviewCount} đánh giá</span>
      </div>

      <div className='mt-auto flex flex-col gap-2'>
        <button
          className='w-full py-2 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition duration-300'
          onClick={handleBuyNow}
        >
          <FiZap className='inline mr-2 w-3 h-3' /> Mua ngay
        </button>
        <button
          className='w-full py-2 rounded-xl bg-gray-100 text-gray-800 text-xs font-medium hover:bg-gray-200 transition duration-300'
          onClick={handleAddToCart}
        >
          <FiShoppingCart className='inline mr-2 w-3 h-3' /> Thêm vào giỏ hàng
        </button>

        {showCheckoutOptions && (
          <div className='absolute bottom-0 left-0 right-0 bg-white p-3 rounded-b-2xl shadow-lg z-10 border-t border-gray-100 transition-all duration-300'>
            <div className='flex flex-col gap-2'>
              <button
                onClick={handleDirectCheckout}
                className='w-full py-2 rounded-xl bg-blue-500 text-white text-xs font-medium hover:bg-blue-600 transition duration-300'
              >
                <FiZap className='inline mr-2 w-3 h-3' /> Thanh toán ngay
              </button>
              <button
                onClick={handleContinueShopping}
                className='w-full py-2 rounded-xl bg-gray-200 text-gray-800 text-xs font-medium hover:bg-gray-300 transition duration-300'
              >
                Tiếp tục mua sắm
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
