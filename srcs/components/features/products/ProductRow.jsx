import { useRef } from 'react';
import ProductCard from '@/components/features/products/ProductCard';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import Spinner from '@/components/ui/Spinner';

const CATEGORY_LABELS = {
  laptop: 'Laptop',
  keyboard: 'Bàn phím',
  headset: 'Tai nghe',
  ssd: 'Ổ cứng SSD',
  other: 'Linh kiện khác',
};

function ProductRow({ products, isCategoryPage = false, onLoadMore, hasMore, loadingMore }) {
  const scrollRefs = useRef({});

  const grouped = products.reduce((acc, product) => {
    const category = product.category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(product);
    return acc;
  }, {});

  const scroll = (category, direction) => {
    const ref = scrollRefs.current[category];
    if (ref) {
      const scrollAmount = 1500;
      ref.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className='space-y-12'>
      {Object.entries(grouped).map(([category, items]) => (
        <section key={category} className='relative'>
          <h2 className='text-xl font-bold mb-4'>
            {CATEGORY_LABELS[category] || category}
          </h2>

          {isCategoryPage ? (
            // Grid layout for category pages
            <>
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
                {items.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
              {hasMore && (
                <button
                  onClick={onLoadMore}
                  disabled={loadingMore}
                  className='mt-8 bg-red-500 text-white px-6 py-3 rounded-lg mx-auto block text-lg transition-all duration-300 hover:bg-red-600 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                >
                  {loadingMore ? (
                    <>
                      <Spinner className='w-5 h-5 text-white' />
                      Đang tải...
                    </>
                  ) : (
                    'Xem thêm'
                  )}
                </button>
              )}
            </>
          ) : (
            // Slider layout for home page
            <>
              <button
                onClick={() => scroll(category, 'left')}
                className='absolute -left-9 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 p-2 rounded-full shadow-md hover:bg-gray-100 transition'
              >
                <AiOutlineLeft size={18} />
              </button>
              <button
                onClick={() => scroll(category, 'right')}
                className='absolute -right-9 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 p-2 rounded-full shadow-md hover:bg-gray-100 transition'
              >
                <AiOutlineRight size={18} />
              </button>
              <div
                ref={(el) => (scrollRefs.current[category] = el)}
                className='flex gap-4 overflow-x-auto overflow-y-hidden scroll-smooth scroll-hidden pr-6'
              >
                {items.map((product, index) => (
                  <div
                    key={index}
                    className='min-w-[250px] max-w-[250px] flex-shrink-0'
                  >
                    <ProductCard {...product} />
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      ))}
    </div>
  );
}

export default ProductRow;
