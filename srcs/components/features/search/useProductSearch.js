import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { getProduct } from '../../services/apiProduct';

// Loại bỏ dấu tiếng Việt
const removeVietnameseTones = (str) => {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
};

// Chuẩn hóa text để tìm kiếm
const normalizeText = (text) => {
  if (!text) return '';
  return removeVietnameseTones(text.toLowerCase())
    .replace(/[^a-z0-9 ]/gi, '') // Chỉ giữ chữ cái, số và khoảng trắng
    .replace(/\s+/g, ' ')
    .trim();
};

// Tính điểm relevance cho sản phẩm
const calculateRelevanceScore = (product, keyword) => {
  const normalizedKeyword = normalizeText(keyword);
  const keywordTokens = normalizedKeyword.split(' ').filter(Boolean);
  if (keywordTokens.length === 0) return 0;

  const titleWords = normalizeText(product.title || '').split(' ');
  const brandWords = normalizeText(product.brand || '').split(' ');

  let score = 0;

  keywordTokens.forEach((token) => {
    if (titleWords.includes(token)) {
      score += 10;
    } else if (titleWords.some((w) => w.startsWith(token))) {
      score += 5;
    }

    if (brandWords.includes(token)) {
      score += 4;
    } else if (brandWords.some((w) => w.startsWith(token))) {
      score += 2;
    }
  });

  if (normalizeText(product.title || '').includes(normalizedKeyword)) {
    score += 15;
  }

  return score;
};

// Tìm kiếm sản phẩm với logic cải thiện
const searchProducts = (products, keyword) => {
  if (!keyword?.trim()) return [];

  const normalizedKeyword = normalizeText(keyword);
  const keywordTokens = normalizedKeyword.split(' ').filter(Boolean);
  if (keywordTokens.length === 0) return [];

  return products
    .map((product) => ({
      ...product,
      relevanceScore: calculateRelevanceScore(product, keyword),
    }))
    .filter((product) => product.relevanceScore > 0)
    .sort((a, b) => {
      if (b.relevanceScore !== a.relevanceScore) {
        return b.relevanceScore - a.relevanceScore;
      }
      const aTitle = (a.title || '').length;
      const bTitle = (b.title || '').length;
      return aTitle - bTitle;
    })
    .map((product) => {
      const { relevanceScore, ...rest } = product;
      return rest;
    });
};

const useProductSearch = () => {
  const [keyword, setKeyword] = useState('');
  const [debouncedKeyword] = useDebounce(keyword, 300);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getProduct();
        const validProducts = Array.isArray(data)
          ? data.filter(
              (product) =>
                product &&
                (product.title || product.name) &&
                typeof (product.title || product.name) === 'string'
            )
          : [];
        setProducts(validProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Không thể tải danh sách sản phẩm');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = searchProducts(products, debouncedKeyword);

  return {
    keyword,
    setKeyword,
    filteredProducts,
    debouncedKeyword,
    loading,
    error,
    totalProducts: products.length,
    hasResults: filteredProducts.length > 0,
    isSearching: keyword.trim().length > 0,
  };
};

export default useProductSearch;
