import { useEffect, useState } from 'react';
import { getFeaturedProducts } from '../services/apiProduct';

const mapToCamelCase = (p) => ({
  ...p,
  originalPrice: Number(p.original_price).toLocaleString('vi-VN') + '₫',
  salePrice: Number(p.sale_price).toLocaleString('vi-VN') + '₫',
  discount:
    Math.round(
      ((Number(p.original_price) - Number(p.sale_price)) /
        Number(p.original_price)) *
        100
    ) + '%',
  rating: p.rating,
  reviewCount: p.review_count,
  thumbnails: p.thumbnails,
  description: p.description,
  detailImage: p.detail_image,
  performance: p.performance,
  extends: p.extends,
  category: p.category,
});

export function useGetFeaturedProducts(category) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // if (!category) return;

    setLoading(true);
    setError(null);

    getFeaturedProducts(category)
      .then((data) => setProducts(data.map(mapToCamelCase)))
      .catch((err) => {
        console.error('Lỗi khi lấy featured products:', err);
        setError('Không thể tải sản phẩm nổi bật.');
      })
      .finally(() => setLoading(false));
  }, [category]);

  return { products, loading, error };
}
