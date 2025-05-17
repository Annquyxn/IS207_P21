import ProductCard from '@/components/features/products/ProductCard';

function ProductRow({ products }) {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6'>
      {products.map((product, index) => (
        <div key={index} className='h-full'>
          <ProductCard
            id={product.id}
            title={product.title}
            image={product.image}
            originalPrice={product.originalPrice}
            salePrice={product.salePrice}
            discount={product.discount}
            rating={product.rating}
            reviewCount={product.reviewCount}
          />
        </div>
      ))}
    </div>
  );
}

export default ProductRow;
