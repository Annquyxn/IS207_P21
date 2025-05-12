import { useState } from "react";
import ProductFilters from "./components/ProductFilters";
import ProductGrid from "./components/ProductGrid";

function ProductSelectionPage() {
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md">
      <ProductFilters
        selectedBrand={selectedBrand}
        onBrandChange={setSelectedBrand}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
      <ProductGrid filter={selectedBrand} sort={sortBy} />
    </div>
  );
}

export default ProductSelectionPage;
