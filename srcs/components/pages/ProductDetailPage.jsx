import React from 'react';
import ProductGallery from '@/components/features/detail/ProductGallery';
import ProductInfo from '@/components/features/detail/ProductInfo';
import ProductDetails from '@/components/features/detail/ProductDetails';
import ExpandSection from '@/components/features/detail/ExpandSection';

const ProductDetailPage = () => {
  return (
    <main className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <article className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-6 flex-wrap">
            <div className="w-full md:w-[45%]">
              <ProductGallery />
            </div>
            <div className="w-full md:w-[45%]">
              <ProductInfo />
            </div>
          </div>
          
          <ProductDetails />
          <ExpandSection />
        </article>
      </div>
    </main>
  );
};

export default ProductDetailPage;