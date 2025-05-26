import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { IoSearchOutline } from 'react-icons/io5';
import ProductSearch from './ProductSearch';
import { getProduct } from '../../services/apiProduct';

const removeVietnameseTones = (str) => str.normalize('NFD').replace(/[̀-ͯ]/g, '');

const Search = () => {
  const [keyword, setKeyword] = useState('');
  const [debouncedKeyword] = useDebounce(keyword, 300);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getProduct();
      setProducts(data);
    };
    fetchData();
  }, []);

  const filteredProducts = products.filter((p) =>
    removeVietnameseTones((p.title || '').toLowerCase()).includes(
      removeVietnameseTones(debouncedKeyword.toLowerCase())
    )
  );

  return (
    <div className='relative w-full max-w-lg'>
      <div className='bg-white flex items-center rounded-full px-6 py-2 shadow-sm'>
        <input
          type='text'
          placeholder='Tìm kiếm sản phẩm...'
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className='flex-grow outline-none text-gray-800 bg-transparent text-base placeholder:text-gray-500'
        />
        <IoSearchOutline className='text-2xl text-gray-600 ml-2' />
      </div>

      {debouncedKeyword && (
        <div className='absolute top-full left-0 right-0 bg-white z-50 shadow rounded mt-2 max-h-80 overflow-y-auto'>
          {filteredProducts.length > 0 ? (
            filteredProducts
              .slice(0, 15)
              .map((product) => (
                <ProductSearch key={product.id} product={product} />
              ))
          ) : (
            <p className='p-4 text-gray-500 text-sm text-center'>
              Không tìm thấy sản phẩm nào.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
