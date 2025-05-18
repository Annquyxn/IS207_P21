import { useState } from 'react';
import ProductRow from '../../features/admin/product/ProductRow';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { AiOutlinePlus } from 'react-icons/ai';
import ProductForm from '../../features/admin/product/ProductForm';
import Modal from '../../ui/Modal';

const products = [
  {
    id: 1,
    name: 'Laptop Gaming Acer Nitro 5',
    category: 'Laptop',
    price: 24990000,
    discount: 2000000,
    image:
      'https://product.hstatic.net/200000722513/product/thinkpad_x9_14_gen_1_ct1_06_555f339751314b21836221e78f062056_grande.png',
  },
];

const pageSize = 7;

const ProductManager = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(products.length / pageSize);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const startIndex = (currentPage - 1) * pageSize;
  const currentProducts = products.slice(startIndex, startIndex + pageSize);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className='relative p-4 space-y-4'>
      <button
        onClick={openModal}
        className='absolute top-4 right-4 p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition'
        title='Thêm sản phẩm'
      >
        <AiOutlinePlus className='w-5 h-5' />
      </button>

      <h2 className='text-xl font-semibold mb-6'>Quản lý sản phẩm</h2>

      {/* Header */}
      <div className='grid grid-cols-[0.6fr_0.5fr_1.2fr_2fr_1fr_1fr_1fr] gap-x-6 px-6 py-4 bg-gray-100 text-sm font-semibold text-gray-600 uppercase rounded-md'>
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
                ? 'bg-blue-600 text-white'
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

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <ProductForm onCloseModal={closeModal} />
        </Modal>
      )}
    </div>
  );
};

export default ProductManager;
