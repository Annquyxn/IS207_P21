import { useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiZap, FiStar } from 'react-icons/fi';

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

  const handleAddToCart = (e) => {
    e.stopPropagation();
    console.log('Thêm giỏ:', title);
  };

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

  return (
    <div
      onClick={handleNavigate}
      className='bg-white p-4 rounded-2xl flex flex-col justify-between transition-transform duration-300 cursor-pointer shadow hover:shadow-lg'
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
      </div>
    </div>
  );
};

export default ProductCard;
