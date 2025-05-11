function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div className="relative pb-[100%]">
        <img
          src={product.image}
          alt={product.name}
          className="absolute h-full w-full object-cover"
        />
        {product.discount && (
          <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
            -{product.discount}%
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-medium text-gray-900 line-clamp-2 h-12">
          {product.name}
        </h3>

        <div className="mt-3 flex items-center justify-between">
          <div className="space-y-1">
            {product.originalPrice && (
              <span className="text-gray-400 line-through text-sm">
                {product.originalPrice.toLocaleString()}đ
              </span>
            )}
            <p className="text-red-600 font-bold">
              {product.price.toLocaleString()}đ
            </p>
          </div>

          <button className="p-2 bg-red-100 rounded-full hover:bg-red-200">
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
