import React from 'react';

const ProductInfo = ({ product }) => {
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
      <div className='text-2xl font-bold text-red-600 mb-1'>
        {product.salePrice}
      </div>
      <div className='flex items-center gap-3 mb-5'>
        <p className='line-through text-gray-500 text-sm'>
          {product.originalPrice}
        </p>
        <span className='bg-red-500 text-white text-sm px-2 py-0.5 rounded-md font-semibold'>
          {product.discount}
        </span>
      </div>

      {/* Nút thao tác */}
      <div className='flex gap-3 mb-6'>
        <button className='bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700'>
          Mua ngay
        </button>
        <button className='bg-gray-100 text-gray-700 px-6 py-2 rounded-xl font-medium hover:bg-gray-200'>
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
