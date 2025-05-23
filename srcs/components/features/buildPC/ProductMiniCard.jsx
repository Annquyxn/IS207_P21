function ProductMiniCard({
  title,
  image,
  salePrice,
  originalPrice,
  onSelect,
  onViewDetail,
  className,
}) {
  return (
    <div
      className={`min-w-[160px] max-w-full border rounded-lg bg-white p-3 flex flex-col justify-between shadow hover:shadow-md transition ${className}`}
    >
      <img
        src={image}
        alt={title}
        className='h-[90px] object-contain mb-2 mx-auto'
      />

      <h3 className='text-sm font-medium text-gray-800 line-clamp-2 h-[3em] mb-1'>
        {title}
      </h3>

      <div className='flex items-center justify-center gap-2 text-sm'>
        <span className='text-gray-400 line-through'>
          {originalPrice
            ? Number(originalPrice).toLocaleString('vi-VN') + 'đ'
            : ''}
        </span>
        <span className='text-red-600 font-semibold'>
          {salePrice ? Number(salePrice).toLocaleString('vi-VN') + 'đ' : ''}
        </span>
      </div>

      <div className='flex justify-between mt-3 gap-2'>
        <button
          onClick={onViewDetail}
          className='text-blue-600 text-xs hover:underline'
        >
          Xem chi tiết
        </button>
        <button
          onClick={onSelect}
          className='bg-red-500 text-white text-x px-3 py-2 rounded hover:bg-red-600'
        >
          Chọn
        </button>
      </div>
    </div>
  );
}

export default ProductMiniCard;
