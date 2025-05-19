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

  console.log('ProductCard:', { originalPrice, salePrice });

  const handleNavigate = () => {
    navigate(`/product/${id}`);
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    console.log('Mua ngay:', title);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    console.log('Thêm giỏ:', title);
  };

  const imageUrl =
    image && image.trim()
      ? image
      : 'https://via.placeholder.com/300x200?text=No+Image';

  return (
    <div
      onClick={handleNavigate}
      className='bg-white p-4 rounded-2xl flex flex-col justify-between transition-transform duration-300 cursor-pointer shadow hover:shadow-lg'
    >
      <img
        src={imageUrl}
        alt={title}
        className='w-full h-[180px] object-contain mb-3 rounded-lg bg-gray-50'
      />

      <div className='text-xs text-gray-500 mb-1'>{brand}</div>
      <h3 className='text-base font-semibold h-[48px] line-clamp-2 mb-2'>
        {title}
      </h3>

      <div className='text-sm text-gray-500 line-through'>{originalPrice}</div>
      <div className='text-lg font-bold text-red-600 mb-2'>{salePrice}</div>

      <div className='flex justify-between items-center mb-3 text-sm'>
        <span className='text-green-600 font-medium'>Giảm {discount}</span>
        <span className='text-yellow-500 font-semibold flex items-center gap-1'>
          <FiStar /> {rating}
        </span>
      </div>

      <div className='text-gray-500 text-xs mb-4'>{reviewCount} đánh giá</div>

      <div className='mt-auto flex flex-col gap-2'>
        <button
          className='w-full py-2 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition duration-300'
          onClick={handleBuyNow}
        >
          <FiZap className='inline mr-2' /> Mua ngay
        </button>
        <button
          className='w-full py-2 rounded-xl bg-gray-100 text-gray-800 text-sm font-medium hover:bg-gray-200 transition duration-300'
          onClick={handleAddToCart}
        >
          <FiShoppingCart className='inline mr-2' /> Thêm vào giỏ hàng
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
