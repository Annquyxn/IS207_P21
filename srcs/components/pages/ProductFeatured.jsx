import ProductRow from '@/components/features/products/ProductRow';
import Spinner from '../ui/Spinner';
import { useGetFeaturedProducts } from '../hooks/useGetFeatureProducts';

const CATEGORY_LABELS = {
  laptop: 'Laptop nổi bật',
  keyboard: 'Bàn phím nổi bật',
  headset: 'Tai nghe nổi bật',
  ssd: 'Ổ cứng di dộng nổi bật',
};

function ProductFeatured() {
  const laptopData = useGetFeaturedProducts('laptop');
  const keyboardData = useGetFeaturedProducts('keyboard');
  const headsetData = useGetFeaturedProducts('headset');
  const ssdData = useGetFeaturedProducts('ssd');

  const categoryList = [
    { key: 'laptop', label: CATEGORY_LABELS.laptop, ...laptopData },
    { key: 'keyboard', label: CATEGORY_LABELS.keyboard, ...keyboardData },
    { key: 'headset', label: CATEGORY_LABELS.headset, ...headsetData },
    { key: 'ssd', label: CATEGORY_LABELS.ssd, ...ssdData },
  ];

  return (
    <main className='bg-gray-200 w-full min-h-screen p-6 flex justify-center'>
      <div className='max-w-[1200px] w-full'>
        <h1 className='text-3xl sm:text-4xl font-extrabold text-center text-red-600 mb-2'>
          Sản Phẩm Nổi Bật
        </h1>
        <p className='text-center text-gray-600 text-base sm:text-lg mb-8'>
          Khám phá những thiết bị công nghệ hot nhất được đánh giá cao bởi khách
          hàng
        </p>

        {categoryList.map(({ key, label, products, loading, error }) => {
          if (loading) {
            return (
              <div key={key} className='flex justify-center items-center py-12'>
                <Spinner className='w-6 h-6 text-red-500' />
              </div>
            );
          }

          if (error || !products || !products.length) return null;

          return (
            <section key={key} className='mb-8 overflow-visible'>
              <h2 className='text-xl font-bold mb-4'>{label}</h2>
              <ProductRow
                products={products}
                isCategoryPage={false}
                hideTitle={true}
              />
            </section>
          );
        })}
      </div>
    </main>
  );
}

export default ProductFeatured;
