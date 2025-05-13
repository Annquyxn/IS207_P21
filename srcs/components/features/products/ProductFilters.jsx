import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';

const ProductFilters = ({ selectedBrand, onBrandChange, sortBy, onSortChange }) => {
  const brands = ['Tất cả', 'AMD', 'Intel'];
  const sortOptions = [
    { value: 'default', label: 'Mặc định' },
    { value: 'price-asc', label: 'Giá tăng dần' },
    { value: 'price-desc', label: 'Giá giảm dần' }
  ];

  return (
    <div className="p-6 border-b">
      {/* Brand Filter */}
      <div className="flex items-center gap-4 mb-4">
        <h3 className="text-lg font-bold">Chọn thương hiệu:</h3>
        <div className="flex gap-2">
          {brands.map(brand => (
            <Button
              key={brand}
              variant={selectedBrand === brand.toLowerCase() ? 'primary' : 'outline'}
              onClick={() => onBrandChange(brand.toLowerCase())}
              className="text-sm px-3 py-1"
            >
              {brand}
            </Button>
          ))}
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <h3 className="text-lg font-bold">Lọc theo:</h3>
        <Button variant="outline" className="flex items-center gap-2">
          <Icon name="price" className="w-4 h-4" />
          <span>Giá</span>
        </Button>
        
        <Button variant="outline" className="flex items-center gap-2">
          <span>Dòng CPU</span>
          <Icon name="chevron-down" className="w-4 h-4" />
        </Button>
        
        <Button variant="outline" className="flex items-center gap-2">
          <span>Socket</span>
          <Icon name="chevron-down" className="w-4 h-4" />
        </Button>
      </div>

      {/* Search and Sort */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <input 
            type="text" 
            placeholder="Tìm kiếm sản phẩm..."
            className="w-full p-2 border rounded pl-10"
          />
          <Icon name="search" className="absolute left-3 top-3 text-gray-400" />
        </div>
        
        <div className="flex items-center gap-2">
          <span className="font-medium">Sắp xếp:</span>
          <select 
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="p-2 border rounded"
          >
            {sortOptions.map(option => (
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