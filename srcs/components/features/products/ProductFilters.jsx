import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";

const ProductFilters = ({
  selectedBrand,
  onBrandChange,
  sortBy,
  onSortChange,
}) => {
  const brands = ["Tất cả", "AMD", "Intel"];
  const sortOptions = [
    { value: "default", label: "Mặc định" },
    { value: "price-asc", label: "Giá tăng dần" },
    { value: "price-desc", label: "Giá giảm dần" },
  ];

  return (
    <div className="p-6 border-b border-gray-200 space-y-6 bg-gray-50 rounded-xl">
      {/* Brand Filter */}
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="text-lg font-semibold">Thương hiệu:</h3>
        {brands.map((brand) => (
          <Button
            key={brand}
            variant={
              selectedBrand === brand.toLowerCase() ? "primary" : "outline"
            }
            onClick={() => onBrandChange(brand.toLowerCase())}
            className="text-sm px-4 py-1.5 rounded-full transition"
          >
            {brand}
          </Button>
        ))}
      </div>

      {/* Advanced Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <h3 className="text-lg font-semibold">Bộ lọc nâng cao:</h3>
        {["Giá", "Dòng CPU", "Socket"].map((label) => (
          <Button
            variant="outline"
            key={label}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full"
          >
            <span>{label}</span>
            <Icon name="chevron-down" className="w-4 h-4 text-gray-500" />
          </Button>
        ))}
      </div>

      {/* Search and Sort */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            className="w-full p-2.5 border border-gray-300 rounded-full pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Icon
            name="search"
            className="absolute left-3 top-2.5 text-gray-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="font-medium">Sắp xếp:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="p-2.5 border border-gray-300 rounded-md"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
