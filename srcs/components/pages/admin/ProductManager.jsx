import { useState } from 'react';
import ProductRow from '../../features/admin/product/ProductRow';
import { AiOutlinePlus } from 'react-icons/ai';
import ProductForm from '../../features/admin/product/ProductForm';
import { useProduct } from '../../features/admin/product/useProduct';
import Pagination from '../../features/admin/product/pagination';

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
      {/* Header */}
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

      {/* Form */}
      {showForm && <ProductForm onCancel={() => setShowForm(false)} />}

      {/* Table header */}
      <div className='grid grid-cols-[0.6fr_0.5fr_1.2fr_2fr_1fr_1fr_1fr] gap-x-6 px-6 py-2 bg-red-100 text-base font-bold text-gray-800 border-b border-red-300 rounded-md'>
        <div></div>
        <div>ID</div>
        <div>Category</div>
        <div>Name</div>
        <div>Price</div>
        <div>Discount</div>
        <div></div>
      </div>

      {/* Table body */}
      <div className='border border-gray-200 rounded-md overflow-hidden'>
        {currentProducts.map((product) => (
          <ProductRow key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default ProductManager;
