import { useParams } from 'react-router-dom';
import ProductInfo from '@/components/features/detail/ProductInfo';
import ProductGallery from '@/components/features/detail/ProductGallery';
import ProductDetails from '@/components/features/detail/ProductDetails';
import ExpandSection from '@/components/features/detail/ExpandSection';
import products from '../features/products/product';

const ProductDetailPage = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);

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
