import { useState, useMemo, useEffect } from 'react';
import ProductFilters from '@/components/features/products/ProductFilters';
import ProductRow from '@/components/features/products/ProductRow';
import { fetchProducts } from '@/components/features/products/apiProduct';
import { parsePrice } from '@/utils/parsePrice';
import { ActiveFilters } from '../features/products/ProductFilters';
import Spinner from '../ui/Spinner';

function ProductPage() {
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [sortBy, setSortBy] = useState('default');
<<<<<<< HEAD
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
=======
>>>>>>> 25080ff9eb9f585b62ee71a2e3b5073bf1e48114
  const [filters, setFilters] = useState({
    priceRange: null,
    cpu: null,
    socket: null,
  });
  const [loading, setLoading] = useState(false);
  const [displayedProducts, setDisplayedProducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      try {
        const data = await fetchProducts();
        setProducts(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    getProducts();
  }, []);

  const processedProducts = useMemo(() => {
    let filtered = products;

    if (selectedBrand !== 'all') {
      filtered = filtered.filter((p) => p.brand === selectedBrand);
    }

    if (filters.priceRange) {
      filtered = filtered.filter((p) => {
        try {
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
        } catch (e) {
          console.error('Error parsing price:', e);
          return false;
        }
      });
    }

    if (filters.cpu) {
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(filters.cpu.toLowerCase())
      );
    }

    if (filters.socket) {
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(filters.socket.toLowerCase())
      );
    }

    return [...filtered].sort((a, b) => {
      if (sortBy === 'price-asc') {
        const priceA = parsePrice(a.salePrice);
        const priceB = parsePrice(b.salePrice);
        return priceA - priceB;
      }
      if (sortBy === 'price-desc') {
        const priceA = parsePrice(a.salePrice);
        const priceB = parsePrice(b.salePrice);
        return priceB - priceA;
      }
      return 0;
    });
  }, [products, selectedBrand, filters, sortBy]);

  //
  useEffect(() => {
<<<<<<< HEAD
    setVisibleProducts(processedProducts.slice(0, 15));
  }, [processedProducts]);
=======
    setLoading(true);
    const timer = setTimeout(() => {
      setDisplayedProducts(processedProducts);
      setLoading(false);
    }, 200);
>>>>>>> 25080ff9eb9f585b62ee71a2e3b5073bf1e48114

    return () => clearTimeout(timer);
  }, [processedProducts]);

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
        ) : error ? (
          <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative'>
            {error}
          </div>
        ) : (
          <ProductRow products={displayedProducts} />
        )}
      </div>
    </main>
  );
}

export default ProductPage;
