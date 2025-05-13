import { useState } from 'react';
import ProductFilters from "@/components/features/products/ProductFilters"; // nếu alias `@` trỏ tới `srcs`
import ProductGrid from '@/components/features/products/ProductGrid';

const ProductSelectionPage = () => {
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [sortBy, setSortBy] = useState('default');

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-sm">
      <ProductFilters 
        selectedBrand={selectedBrand}
        onBrandChange={setSelectedBrand}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
      <ProductGrid 
        filter={selectedBrand}
        sort={sortBy}
      />
    </div>
  );
};

export default ProductSelectionPage;