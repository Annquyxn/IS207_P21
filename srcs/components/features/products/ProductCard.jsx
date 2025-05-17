import { useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiZap, FiStar } from 'react-icons/fi';

const ProductCard = ({
  id,
  title,
  image,
  originalPrice,
  salePrice,
  discount,
  rating,
  reviewCount,
}) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/product/${id}`)}
      className='bg-white p-4  rounded-2xl flex flex-col justify-between transition-transform duration-300 cursor-pointer'
    >
      <img
        src={image}
        alt={title}
        className='w-full h-[180px] object-contain mb-3 rounded-lg'
      />

      <h3 className='text-base font-semibold h-[48px] line-clamp-2 mb-2'>
        {title}
      </h3>

      <div className='text-sm text-gray-500 line-through'>{originalPrice}</div>
      <div className='text-lg font-bold text-red-600 mb-2'>{salePrice}</div>

      <div className='flex justify-between items-center mb-3 text-sm'>
        <span className='text-green-600 font-medium'>{discount}</span>
        <span className='text-yellow-500 font-semibold flex items-center gap-1'>
          <FiStar /> {rating}
        </span>
      </div>

      <div className='text-gray-500 text-xs mb-4'>{reviewCount} đánh giá</div>

      <div className='mt-auto flex flex-col gap-2'>
        <button
          className='w-full py-2 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition duration-300'
          onClick={(e) => {
            e.stopPropagation();
            console.log('Mua ngay:', title);
          }}
        >
          <FiZap className='inline mr-2' /> Mua ngay
        </button>
        <button
          className='w-full py-2 rounded-xl bg-gray-100 text-gray-800 text-sm font-medium hover:bg-gray-200 transition duration-300'
          onClick={(e) => {
            e.stopPropagation();
            console.log('Thêm giỏ:', title);
          }}
        >
          <FiShoppingCart className='inline mr-2' /> Thêm vào giỏ hàng
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
