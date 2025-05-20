import { useEffect, useState } from 'react';
import { getFeaturedProducts } from '../services/apiProduct';
import { convertKeysToCamelCase } from '@/utils/caseConverter';

export function useGetFeaturedProducts(category) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getFeaturedProducts(category)
      .then((data) => setProducts(convertKeysToCamelCase(data)))
      .catch((err) => {
        console.error('Lỗi khi lấy featured products:', err);
        setError('Không thể tải sản phẩm nổi bật.');
      })
      .finally(() => setLoading(false));
  }, [category]);

  return { products, loading, error };
}
