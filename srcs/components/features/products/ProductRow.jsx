function ProductRow({ products }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {products.map((product, index) => (
        <div
          key={index}
          className="bg-white p-4 shadow-md rounded-xl transition-transform duration-500 hover:scale-105 hover:shadow-xl"
        >
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-[200px] object-contain mb-4 transition-transform duration-500 hover:scale-110"
          />
          <h3 className="text-lg font-bold mb-2">{product.title}</h3>

          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500 line-through">
              {product.originalPrice}
            </span>
            <span className="text-xl font-extrabold text-red-600">
              {product.salePrice}
            </span>
          </div>

          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-green-600">
              {product.discount}
            </span>
            <div className="flex items-center gap-1">
              <span className="text-sm text-yellow-500 font-semibold">
                {product.rating}
              </span>
              <span className="text-sm text-gray-500">
                ({product.reviewCount} đánh giá)
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button className="w-full py-2 bg-blue-600 text-white rounded-xl font-semibold text-base transition-transform transform hover:scale-105 hover:bg-blue-700 hover:shadow-md">
              Mua ngay
            </button>
            <button className="w-full py-2 bg-gray-300 text-black rounded-xl font-semibold text-base transition-transform transform hover:scale-105 hover:bg-gray-400 hover:shadow-md">
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductRow;
