function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
      <div className="relative pb-[100%] bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="absolute h-full w-full object-contain p-2"
        />
        {product.discount && (
          <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
            -{product.discount}%
          </span>
        )}
      </div>

      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-gray-900 line-clamp-2 min-h-[48px]">
          {product.name}
        </h3>

        <div className="flex items-center justify-between mt-2">
          <div>
            {product.originalPrice && (
              <div className="text-gray-400 line-through text-sm">
                {product.originalPrice.toLocaleString()}đ
              </div>
            )}
            <p className="text-red-600 font-bold text-lg">
              {product.price.toLocaleString()}đ
            </p>
          </div>
          <button className="p-2 bg-red-100 rounded-full hover:bg-red-200 transition">
            <svg
              className="w-5 h-5 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
