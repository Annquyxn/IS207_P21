import { HiPencil, HiTrash } from 'react-icons/hi2';

function ProductRow({ product }) {
  const { id, name, category, price, discount, image } = product;

  return (
    <div
      className='grid grid-cols-[0.6fr_0.5fr_1.2fr_2fr_1fr_1fr_1fr] gap-x-6 items-center py-4 px-6 border-b border-gray-200'
      role='row'
    >
      {/* Hình ảnh */}
      <img
        src={image}
        alt={name}
        className='w-16 aspect-video object-cover object-center'
      />

      {/* ID */}
      <div className='text-sm text-gray-700'>{id}</div>

      {/* Category */}
      <div className='text-sm text-gray-700'>{category}</div>

      {/* Name */}
      <div className='font-semibold text-gray-800 text-base'>{name}</div>

      {/* Price */}
      <div className='font-semibold text-sm text-gray-900'>
        {price?.toLocaleString()}₫
      </div>

      {/* Discount */}
      <div className='text-sm font-medium text-green-600'>
        {discount ? `${discount?.toLocaleString()}₫` : <span>&mdash;</span>}
      </div>

      {/* Actions */}
      <div className='flex justify-center items-center gap-3'>
        <button
          onClick={() => alert(`Delete ${id}`)}
          className='bg-red-600 text-white rounded p-1.5 hover:bg-red-700 transition'
        >
          <HiTrash className='w-5 h-5' />
        </button>
      </div>
    </div>
  );
}

export default ProductRow;
