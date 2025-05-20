import { FiShoppingCart, FiZap } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '@/components/features/notify/NotificationContext';

const ProductInfo = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useNotifications();

  const handleBuyNow = () => {
    navigate('/order', {
      state: {
        product: {
          id: product.id,
          title: product.title,
          image: product.image,
          originalPrice: product.originalPrice,
          salePrice: product.salePrice,
          discount: product.discount,
          quantity: 1,
        },
      },
    });
  };

  const handleAddToCart = () => {
    // Gọi hàm thông báo khi thêm sản phẩm vào giỏ hàng
    addToCart({ name: product.title });

    // Logic thêm vào giỏ hàng có thể được thêm ở đây
  };

  // Tính phần trăm giảm giá
  const calculateDiscountPercentage = () => {
    try {
      // Xử lý chuỗi giá
      const original = product.originalPrice
        ? parseInt(product.originalPrice.replace(/[^\d]/g, ''))
        : 0;
      const sale = product.salePrice
        ? parseInt(product.salePrice.replace(/[^\d]/g, ''))
        : 0;

      // Kiểm tra nếu giá gốc là 0 hoặc nhỏ hơn giá bán
      if (original === 0 || original <= sale) {
        return product.discount
          ? parseInt(product.discount.replace(/[^\d%]/g, ''))
          : 0;
      }

      // Tính phần trăm giảm giá
      const percentage = Math.round(((original - sale) / original) * 100);
      return percentage > 0 ? percentage : 0;
    } catch (error) {
      // Nếu có lỗi, trả về giá trị từ prop discount nếu có
      console.error('Error calculating discount:', error);
      return product.discount
        ? parseInt(product.discount.replace(/[^\d%]/g, ''))
        : 0;
    }
  };

  // Format giá theo định dạng VND
  const formatPrice = (price) => {
    if (!price) return '0₫';
    try {
      const numericPrice =
        typeof price === 'number'
          ? price
          : parseInt(price.toString().replace(/[^\d]/g, ''));

      return numericPrice.toLocaleString('vi-VN') + '₫';
    } catch (error) {
      return '0₫';
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  const discountPercentage = calculateDiscountPercentage();
  const formattedSalePrice = formatPrice(product.salePrice);
  const formattedOriginalPrice = formatPrice(product.originalPrice);

  return (
    <section className='w-full mt-6'>
      {/* Tên sản phẩm */}
      <h1 className='text-2xl font-bold mb-2'>{product.title}</h1>

      {/* Đánh giá */}
      <div className='flex items-center gap-2 mb-2'>
        <div className='flex text-yellow-400 text-lg'>
          {[1, 2, 3, 4, 5].map((star) => (
            <i key={star} className='ti ti-star' />
          ))}
        </div>
        <span className='text-blue-600 text-sm'>
          {product.reviewCount} đánh giá
        </span>
      </div>

      {/* Giá bán & giảm giá */}
      <div className='flex items-center gap-3 mb-1'>
        <div className='text-2xl font-bold text-red-600'>
          {formattedSalePrice}
        </div>
        {/* Hiển thị discount badge luôn nếu có */}
        {(discountPercentage > 0 || product.discount) && (
          <span className='bg-red-500 text-white text-sm px-2 py-0.5 rounded-md font-medium'>
            -
            {discountPercentage || product.discount?.replace(/[^\d]/g, '') || 0}
            %
          </span>
        )}
      </div>
      {product.originalPrice && product.originalPrice !== product.salePrice && (
        <div className='text-sm text-gray-500 line-through mb-5'>
          {formattedOriginalPrice}
        </div>
      )}

      {/* Nút thao tác */}
      <div className='flex gap-3 mb-6'>
        <button
          onClick={handleBuyNow}
          className='bg-red-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-red-700 hover:-translate-y-0.5 active:translate-y-0.5 transition duration-200 ease-in-out'
        >
          <FiZap className='inline-block mr-2' />
          Mua ngay
        </button>
        <button
          onClick={handleAddToCart}
          className='bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl font-semibold shadow-md transition duration-200 hover:-translate-y-0.5 active:translate-y-0.5 ease-in-out'
        >
          <FiShoppingCart className='inline-block mr-2' />
          Thêm vào giỏ
        </button>
      </div>

      {/* Quà tặng kèm */}
      <div className='bg-gray-50 border border-dashed border-gray-300 p-4 rounded-lg text-sm'>
        <p className='font-semibold mb-1'>🎁 Quà tặng kèm:</p>
        <ul className='list-disc list-inside space-y-1'>
          <li>Bàn phím cơ AKKO</li>
          <li>Chuột gaming Logitech</li>
          <li>Balo</li>
        </ul>
      </div>
    </section>
  );
};

export default ProductInfo;
