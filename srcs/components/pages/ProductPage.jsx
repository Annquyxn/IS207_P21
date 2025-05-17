import { useState, useEffect, useMemo } from 'react';
import ProductFilters from '@/components/features/products/ProductFilters';
import ProductRow from '@/components/features/products/ProductRow';
import product from '@/components/features/products/product';
import { parsePrice } from '@/utils/parsePrice';
import { ActiveFilters } from '../features/products/ProductFilters';
import Spinner from '../ui/Spinner';

function ProductPage() {
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    priceRange: null,
    cpu: null,
    socket: null,
  });

  const processedProducts = useMemo(() => {
    let filtered = product;

    // Lọc theo thương hiệu
    if (selectedBrand !== 'all') {
      filtered = filtered.filter((p) => p.brand === selectedBrand);
    }

    // Lọc theo khoảng giá
    if (filters.priceRange) {
      filtered = filtered.filter((p) => {
        const price = parsePrice(p.salePrice);
        switch (filters.priceRange) {
          case 'Dưới 1 triệu':
            return price < 1_000_000;
          case '1-3 triệu':
            return price >= 1_000_000 && price <= 3_000_000;
          case '3-5 triệu':
            return price >= 3_000_000 && price <= 5_000_000;
          case 'Trên 5 triệu':
            return price > 5_000_000;
          default:
            return true;
        }
      });
    }

    // Lọc theo dòng CPU
    if (filters.cpu) {
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(filters.cpu.toLowerCase())
      );
    }

    // Lọc theo socket (nếu có field socket riêng thì đổi lại cho chính xác)
    if (filters.socket) {
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(filters.socket.toLowerCase())
      );
    }

    // Sắp xếp
    return [...filtered].sort((a, b) => {
      const priceA = parsePrice(a.salePrice);
      const priceB = parsePrice(b.salePrice);

      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      return 0;
    });
  }, [selectedBrand, filters, sortBy]);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setVisibleProducts(processedProducts.slice(0, 15));
      setLoading(false);
    }, 600);
  }, [processedProducts]);

  const loadMore = () => {
    setVisibleProducts((prev) => [
      ...prev,
      ...processedProducts.slice(prev.length, prev.length + 10),
    ]);
  };

  return (
    <main className='bg-gray-200 w-full min-h-screen p-6 flex justify-center'>
      <div className='max-w-[1200px] w-full'>
        <div className='bg-white rounded-2xl shadow-xl p-6 mb-6'>
          <ProductFilters
            selectedBrand={selectedBrand}
            onBrandChange={setSelectedBrand}
            sortBy={sortBy}
            onSortChange={setSortBy}
            filters={filters}
            onFilterChange={(key, value) =>
              setFilters((prev) => ({ ...prev, [key]: value }))
            }
          />
        </div>
        <ActiveFilters
          selectedBrand={selectedBrand}
          filters={filters}
          onClearBrand={() => setSelectedBrand('all')}
          onClearFilter={(key) =>
            setFilters((prev) => ({ ...prev, [key]: null }))
          }
          onClearAll={() => {
            setSelectedBrand('all');
            setFilters({
              priceRange: null,
              cpu: null,
              socket: null,
            });
          }}
        />

        {loading ? (
          <div className='flex justify-center py-12'>
            <Spinner className='w-12 h-12 text-blue-500' />
          </div>
        ) : (
          <>
            <ProductRow products={visibleProducts} />
            {visibleProducts.length < processedProducts.length && (
              <button
                className='mt-4 bg-red-500 text-white p-4 rounded-xl mx-auto block text-xl transition-all duration-300 hover:scale-110'
                onClick={loadMore}
              >
                Xem thêm
              </button>
            )}
          </>
        )}
      </div>
    </main>
  );
}

export default ProductPage;
