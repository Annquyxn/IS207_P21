import { useParams } from 'react-router-dom';
import ProductInfo from '@/components/features/detail/ProductInfo';
import ProductGallery from '@/components/features/detail/ProductGallery';
import ProductDetails from '@/components/features/detail/ProductDetails';
import ExpandSection from '@/components/features/detail/ExpandSection';
import products from '@/components/features/products/product'; // sửa path cho đúng nha

const ProductDetailPage = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <main className='min-h-screen flex items-center justify-center'>
        <p className='text-gray-500 text-lg'>Không tìm thấy sản phẩm.</p>
      </main>
    );
  }

  return (
    <main className='bg-white w-full max-w-[1200px] mx-auto p-6'>
      <ProductGallery image={product.image} />
      <ProductInfo product={product} />
      <ProductDetails product={product} />
      <ExpandSection />
    </main>
  );
};

export default ProductDetailPage;
