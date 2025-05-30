import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { useState, useEffect, useRef } from 'react';

const ProductFilters = ({
  selectedBrand,
  onBrandChange,
  sortBy,
  onSortChange,
  onFilterChange,
}) => {
  const brands = ['Tất cả', 'AMD', 'Intel', 'Asus', 'Acer', 'Giga', 'HP'];
  const sortOptions = [
    { value: 'default', label: 'Mặc định' },
    { value: 'price-asc', label: 'Giá tăng dần' },
    { value: 'price-desc', label: 'Giá giảm dần' },
  ];

  const [activeFilter, setActiveFilter] = useState(null);
  const filterRef = useRef(null);

  const filterOptions = {
    Giá: ['Dưới 1 triệu', '1-3 triệu', '3-5 triệu', 'Trên 5 triệu'],
    'Dòng CPU': ['AMD Ryzen', 'Intel Core i7', 'Intel Core i9'],
    Socket: ['LGA 1200', 'AM4', 'LGA 1700'],
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setActiveFilter(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleFilterClick = (label) => {
    setActiveFilter(activeFilter === label ? null : label);
  };

  const handleOptionSelect = (label, option) => {
    const keyMap = {
      Giá: 'priceRange',
      'Dòng CPU': 'cpu',
      Socket: 'socket',
    };

    onFilterChange(keyMap[label], option);
    setActiveFilter(null);
  };

  return (
    <div className='bg-white rounded-2xl p-6 shadow-md space-y-6'>
      {/* Thương hiệu */}
      <div className='flex flex-wrap items-center gap-2'>
        <span className='font-semibold text-gray-700'>Thương hiệu:</span>
        {brands.map((brand) => (
          <button
            key={brand}
            onClick={() => onBrandChange(brand.toLowerCase())}
            className={`px-4 py-1.5 text-sm rounded-full border transition ${
              selectedBrand === brand.toLowerCase()
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {brand}
          </button>
        ))}
      </div>

      {/* Bộ lọc nâng cao */}
      <div className='flex flex-wrap items-center gap-4' ref={filterRef}>
        <span className='font-semibold text-gray-700'>Bộ lọc nâng cao:</span>
        {Object.keys(filterOptions).map((label) => (
          <div key={label} className='relative'>
            <button
              onClick={() => handleFilterClick(label)}
              className='px-4 py-1.5 text-sm rounded-full border bg-gray-50 hover:bg-gray-100 flex items-center gap-2'
            >
              {label}
              <Icon name='chevron-down' className='w-4 h-4 text-gray-400' />
            </button>
            {activeFilter === label && (
              <ul className='absolute top-full left-0 mt-2 bg-white border rounded-lg shadow-md z-10 w-48 overflow-hidden'>
                {filterOptions[label].map((option) => (
                  <li
                    key={option}
                    onClick={() => handleOptionSelect(label, option)}
                    className='px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer'
                  >
                    {option}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* Search + Sort */}
      <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
        <div className='relative w-full md:w-1/2'>
          <input
            type='text'
            placeholder='Tìm kiếm sản phẩm...'
            className='w-full px-4 py-2 pl-10 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none'
          />
          <Icon
            name='search'
            className='absolute left-3 top-2.5 text-gray-400'
          />
        </div>
        <div className='flex items-center gap-2'>
          <span className='text-sm font-medium text-gray-700'>Sắp xếp:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className='px-3 py-2 border rounded-md bg-white'
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

// Component hiển thị các bộ lọc đang được áp dụng
export const ActiveFilters = ({
  selectedBrand,
  filters,
  onClearBrand,
  onClearFilter,
  onClearAll,
}) => {
  const hasFilters =
    selectedBrand !== 'all' ||
    filters.priceRange ||
    filters.cpu ||
    filters.socket;

  if (!hasFilters) return null;

  return (
    <div className='mb-6 flex flex-wrap items-center gap-3 bg-white p-4 rounded-xl shadow'>
      <span className='font-semibold text-gray-700'>Đang lọc:</span>

      {selectedBrand !== 'all' && (
        <span className='flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm'>
          Thương hiệu: {selectedBrand}
          <button
            onClick={onClearBrand}
            className='text-blue-500 hover:text-blue-700 font-bold ml-1'
          >
            ✕
          </button>
        </span>
      )}

      {filters.priceRange && (
        <span className='flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm'>
          Giá: {filters.priceRange}
          <button
            onClick={() => onClearFilter('priceRange')}
            className='text-green-500 hover:text-green-700 font-bold ml-1'
          >
            ✕
          </button>
        </span>
      )}

      {filters.cpu && (
        <span className='flex items-center gap-1 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm'>
          CPU: {filters.cpu}
          <button
            onClick={() => onClearFilter('cpu')}
            className='text-purple-500 hover:text-purple-700 font-bold ml-1'
          >
            ✕
          </button>
        </span>
      )}

      {filters.socket && (
        <span className='flex items-center gap-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm'>
          Socket: {filters.socket}
          <button
            onClick={() => onClearFilter('socket')}
            className='text-yellow-500 hover:text-yellow-700 font-bold ml-1'
          >
            ✕
          </button>
        </span>
      )}

      <button
        onClick={onClearAll}
        className='ml-auto text-sm text-red-500 hover:underline'
      >
        Xoá tất cả
      </button>
    </div>
  );
};
