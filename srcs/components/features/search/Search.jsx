import { IoSearchOutline } from 'react-icons/io5';
import { BiLoaderAlt } from 'react-icons/bi'; // Thêm icon loading
import ProductSearch from './ProductSearch';
import useProductSearch from './useProductSearch';

const Search = () => {
  const {
    keyword,
    setKeyword,
    filteredProducts,
    debouncedKeyword,
    loading,
    error,
    totalProducts,
    hasResults,
    isSearching,
  } = useProductSearch();

  // Render loading state
  const renderLoading = () => (
    <div className='flex items-center justify-center p-4'>
      <BiLoaderAlt className='animate-spin text-xl text-gray-500 mr-2' />
      <span className='text-gray-500 text-sm'>Đang tải...</span>
    </div>
  );

  // Render error state
  const renderError = () => (
    <div className='p-4 text-center'>
      <p className='text-red-500 text-sm'>{error}</p>
      <p className='text-gray-400 text-xs mt-1'>Vui lòng thử lại sau</p>
    </div>
  );

  // Render no results
  const renderNoResults = () => (
    <div className='p-4 text-center'>
      <p className='text-gray-500 text-sm'>
        Không tìm thấy sản phẩm nào cho "{debouncedKeyword}"
      </p>
      <p className='text-gray-400 text-xs mt-1'>
        Thử tìm kiếm với từ khóa khác
      </p>
    </div>
  );

  // Render search results
  const renderResults = () => (
    <>
      <div className='px-4 py-2 border-b bg-gray-50'>
        <p className='text-xs text-gray-600'>
          Tìm thấy {filteredProducts.length} sản phẩm
          {totalProducts > 0 && ` trong ${totalProducts} sản phẩm`}
        </p>
      </div>
      <div className='max-h-64 overflow-y-auto'>
        {filteredProducts
          .slice(0, 10) // Giảm xuống 10 để UX tốt hơn
          .map((product) => (
            <ProductSearch
              key={product.id}
              product={product}
              searchKeyword={debouncedKeyword} // Truyền keyword để highlight
            />
          ))}
      </div>
      {filteredProducts.length > 10 && (
        <div className='px-4 py-2 border-t bg-gray-50 text-center'>
          <p className='text-xs text-gray-500'>
            Và {filteredProducts.length - 10} sản phẩm khác...
          </p>
        </div>
      )}
    </>
  );

  // Render dropdown content
  const renderDropdownContent = () => {
    if (loading) return renderLoading();
    if (error) return renderError();
    if (!hasResults) return renderNoResults();
    return renderResults();
  };

  return (
    <div className='relative w-full max-w-lg'>
      <div className='bg-white flex items-center rounded-full px-6 py-2 shadow-sm border border-gray-200 focus-within:border-blue-500 focus-within:shadow-md transition-all duration-200'>
        <input
          type='text'
          placeholder='Tìm kiếm sản phẩm...'
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className='flex-grow outline-none text-gray-800 bg-transparent text-base placeholder:text-gray-500'
          autoComplete='off'
        />
        <IoSearchOutline className='text-2xl text-gray-600 ml-2 flex-shrink-0' />
      </div>

      {/* Search Dropdown */}
      {isSearching && debouncedKeyword && (
        <div className='absolute top-full left-0 right-0 bg-white z-50 shadow-lg rounded-lg mt-2 border border-gray-200 overflow-hidden'>
          {renderDropdownContent()}
        </div>
      )}

      {/* Overlay để đóng dropdown khi click outside */}
      {isSearching && debouncedKeyword && (
        <div className='fixed inset-0 z-40' onClick={() => setKeyword('')} />
      )}
    </div>
  );
};

export default Search;
