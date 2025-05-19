import { useState } from 'react';
import ProductRow from '../../features/admin/product/ProductRow';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { AiOutlinePlus } from 'react-icons/ai';
import ProductForm from '../../features/admin/product/ProductForm';
import { useProduct } from '../../features/admin/product/useProduct';

const pageSize = 7;

const ProductManager = () => {
  const { isLoading, products } = useProduct();
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);

  const totalPages = Math.ceil(products.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentProducts = products.slice(startIndex, startIndex + pageSize);

  if (isLoading || !products)
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-600'></div>
      </div>
    );

  return (
    <div className='relative p-4 space-y-6'>
      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-semibold'>Quản lý sản phẩm</h2>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className='flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition'
        >
          <AiOutlinePlus className='w-5 h-5' />
          {showForm ? 'Ẩn form' : 'Thêm sản phẩm'}
        </button>
      </div>
      {showForm && <ProductForm onCancel={() => setShowForm(false)} />}
      {/* Header */}
      <div className='grid grid-cols-[0.6fr_0.5fr_1.2fr_2fr_1fr_1fr_1fr] gap-x-6 px-6 py-2 bg-red-100 text-base font-bold text-gray-800 border-b border-red-300 rounded-md'>
        <div></div>
        <div>ID</div>
        <div>Category</div>
        <div>Name</div>
        <div>Price</div>
        <div>Discount</div>
        <div></div>
      </div>
      {/* Body */}
      <div className='border border-gray-200 rounded-md overflow-hidden'>
        {currentProducts.map((product) => (
          <ProductRow key={product.id} product={product} />
        ))}
      </div>
      {/* Pagination Controls */}
      <div className='flex justify-center gap-2 pt-4'>
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          className='px-3 py-1 border rounded hover:bg-gray-100'
        >
          <HiChevronLeft className='w-5 h-5' />
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 border rounded ${
              currentPage === i + 1
                ? 'bg-red-600 text-white'
                : 'hover:bg-gray-100'
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          className='px-3 py-1 border rounded hover:bg-gray-100'
        >
          <HiChevronRight className='w-5 h-5' />
        </button>
      </div>
    </div>
  );
};

export default ProductManager;
