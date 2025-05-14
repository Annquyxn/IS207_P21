const ProductCard = ({
  banner,
  title,
  image,
  originalPrice,
  salePrice,
  discount,
  rating,
  reviewCount,
}) => {
  return (
    <article
      className="bg-white rounded border border-gray-300 p-4 flex flex-col items-start w-full max-w-[236px] 
      transform transition-transform duration-500 hover:scale-105 hover:shadow-xl cursor-pointer"
    >
      <div className="w-full h-[236px] overflow-hidden rounded mb-2">
        <img
          src={banner}
          alt="banner"
          className="w-full h-full object-contain transform transition-transform duration-500 hover:scale-110"
        />
      </div>

      <h2 className="text-black text-base font-bold mb-3 leading-snug line-clamp-2">
        {title}
      </h2>

      <div className="bg-gray-100 rounded w-full p-3 flex justify-center items-center overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-[185px] h-auto transform transition-transform duration-500 hover:scale-110"
        />
      </div>

      <p className="text-gray-600 text-sm font-bold mt-4 mb-2">
        {originalPrice}
      </p>

      <div className="flex items-start gap-3">
        <p className="text-red-600 text-lg font-bold">{salePrice}</p>
        <span className="text-red-500 border border-red-600 px-2 py-1 rounded-full text-sm font-semibold transition-transform duration-300 hover:scale-110">
          {discount}
        </span>
      </div>

      <div className="flex mt-2 items-center gap-2">
        <div className="flex items-center gap-1 text-yellow-400 text-sm">
          <span>{rating}</span>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/1f2be4e0174f28cccf3c9f67429bb3524ef34cf9"
            alt="rating"
            className="w-3 h-3"
          />
        </div>
        <span className="text-gray-500 text-xs font-bold">
          ({reviewCount} đánh giá)
        </span>
      </div>
    </article>
  );
};

export default ProductCard;
