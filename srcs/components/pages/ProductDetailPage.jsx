import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ProductInfo from '@/components/features/detail/ProductInfo';
import ProductGallery from '@/components/features/detail/ProductGallery';
import ProductDetails from '@/components/features/detail/ProductDetails';
import ExpandSection from '@/components/features/detail/ExpandSection';
import { fetchProducts } from '@/components/features/products/apiProduct';
import Spinner from '@/components/ui/Spinner';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getProduct = async () => {
      setLoading(true);
      try {
        const data = await fetchProducts();
        const foundProduct = data.find((p) => p.id === id);
        setProduct(foundProduct || null);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };
    
    getProduct();
  }, [id]);

  if (loading) {
    return (
      <main className='min-h-screen flex items-center justify-center'>
        <Spinner className='w-12 h-12 text-blue-500' />
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className='min-h-screen flex items-center justify-center'>
        <p className='text-gray-500 text-lg'>
          {error || 'Không tìm thấy sản phẩm.'}
        </p>
      </main>
    );
  }
  if (!product)
    return <p className='text-center py-10'>Không tìm thấy sản phẩm</p>;

  return (
    <main className='bg-white w-full max-w-[1200px] mx-auto px-4 py-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <ProductGallery image={product.image} thumbnails={product.thumbnails} />
        <ProductInfo product={product} />
      </div>

      <div className='mt-10'>
        <ProductDetails product={product} />
      </div>

      <div className='mt-8'>
        <ExpandSection product={product} />
      </div>
    </main>
  );
};

export default ProductDetailPage;
