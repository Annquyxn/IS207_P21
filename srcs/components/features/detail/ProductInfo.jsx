import React from 'react';

const ProductInfo = () => {
  return (
    <section className="w-full">
      <h1 className="text-xl mb-3">Tên sản phẩm: laptop Abc màn hình..., cấu hình...</h1>

      <div className="flex items-center gap-2">
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <i key={star} className="ti ti-star text-yellow-400"></i>
          ))}
        </div>
        <a href="#reviews" className="text-blue-600">Xem đánh giá</a>
      </div>

      <div className="my-4">
        <p className="text-lg font-bold text-red-600">12.000.000đ</p>
        <div className="flex items-center gap-2">
          <p className="line-through text-gray-500">15.000.000đ</p>
          <span className="bg-orange-500 text-white px-1.5 py-0.5 rounded">-20%</span>
        </div>
      </div>

      <div className="flex gap-3 mb-4">
        <button className="bg-blue-600 text-white px-5 py-2.5 rounded-md cursor-pointer">
          Mua hàng
        </button>
        <button className="bg-gray-300 px-5 py-2.5 rounded-md cursor-pointer">
          Thêm vào giỏ hàng
        </button>
      </div>

      <div className="gift-section">
        <p className="font-medium">Quà tặng kèm:</p>
        <ul className="pl-5 m-0">
          <li>• Bàn phím A</li>
          <li>• Chuột B</li>
          <li>• Balo C</li>
        </ul>
      </div>
    </section>
  );
};

export default ProductInfo;