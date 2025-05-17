import React from 'react';

const ProductDetails = () => {
  return (
    <section className='mt-10'>
      <h2 className='text-2xl font-bold mb-4'>Thông tin chi tiết sản phẩm</h2>

      <h3 className='text-lg font-semibold mb-2'>Mô tả chung</h3>
      <p className='text-gray-700 leading-relaxed mb-4'>
        Màn hình GIGABYTE G25F2 là một trong những sản phẩm nổi bật trong dòng
        màn hình gaming...
      </p>

      <div className='w-full my-6 rounded-xl overflow-hidden'>
        <img
          src='https://placehold.co/800x400'
          alt='GIGABYTE G25F2'
          className='w-full object-cover rounded-md shadow-md'
        />
      </div>

      <h3 className='text-lg font-semibold mb-2'>Hiệu suất và trải nghiệm</h3>
      <p className='text-gray-700 leading-relaxed'>
        Với tần số quét lên đến 200Hz và thời gian phản hồi 1ms...
      </p>
    </section>
  );
};

export default ProductDetails;
