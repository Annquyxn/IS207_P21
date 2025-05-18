import { useState } from 'react';

function ProductForm({ onCloseModal }) {
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    brand: '',
    image: '',
    originalPrice: '',
    salePrice: '',
    discount: '',
    rating: '',
    reviewCount: '',
    thumbnails: '',
    description: '',
    detailImage: '',
    performance: '',
    extends: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form className='space-y-6'>
      {/* Thông tin chung */}
      <section className='bg-gray-50 p-4 rounded-md'>
        <h3 className='text-sm font-semibold text-gray-700 uppercase mb-4'>
          Thông tin chung
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div>
            <label className='text-sm font-medium'>ID</label>
            <input
              type='text'
              name='id'
              value={formData.id}
              onChange={handleChange}
              className='w-full border rounded px-3 py-2 mt-1'
            />
          </div>
          <div>
            <label className='text-sm font-medium'>Tiêu đề</label>
            <input
              type='text'
              name='title'
              value={formData.title}
              onChange={handleChange}
              className='w-full border rounded px-3 py-2 mt-1'
            />
          </div>
          <div>
            <label className='text-sm font-medium'>Thương hiệu</label>
            <input
              type='text'
              name='brand'
              value={formData.brand}
              onChange={handleChange}
              className='w-full border rounded px-3 py-2 mt-1'
            />
          </div>
        </div>
      </section>

      {/* Giá & hình ảnh */}
      <section className='bg-gray-50 p-4 rounded-md'>
        <h3 className='text-sm font-semibold text-gray-700 uppercase mb-4'>
          Giá & Ảnh
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
          <div>
            <label className='text-sm font-medium'>Ảnh chính</label>
            <input
              type='text'
              name='image'
              value={formData.image}
              onChange={handleChange}
              placeholder='URL ảnh'
              className='w-full border rounded px-3 py-2 mt-1'
            />
          </div>
          <div>
            <label className='text-sm font-medium'>Giá gốc</label>
            <input
              type='number'
              name='originalPrice'
              value={formData.originalPrice}
              onChange={handleChange}
              className='w-full border rounded px-3 py-2 mt-1'
            />
          </div>
          <div>
            <label className='text-sm font-medium'>Giá sale</label>
            <input
              type='number'
              name='salePrice'
              value={formData.salePrice}
              onChange={handleChange}
              className='w-full border rounded px-3 py-2 mt-1'
            />
          </div>
          <div>
            <label className='text-sm font-medium'>Giảm giá (%)</label>
            <input
              type='number'
              name='discount'
              value={formData.discount}
              onChange={handleChange}
              className='w-full border rounded px-3 py-2 mt-1'
            />
          </div>
        </div>
      </section>

      {/* Đánh giá */}
      <section className='bg-gray-50 p-4 rounded-md'>
        <h3 className='text-sm font-semibold text-gray-700 uppercase mb-4'>
          Đánh giá
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div>
            <label className='text-sm font-medium'>Rating</label>
            <input
              type='number'
              name='rating'
              step='0.1'
              value={formData.rating}
              onChange={handleChange}
              className='w-full border rounded px-3 py-2 mt-1'
            />
          </div>
          <div>
            <label className='text-sm font-medium'>Lượt đánh giá</label>
            <input
              type='number'
              name='reviewCount'
              value={formData.reviewCount}
              onChange={handleChange}
              className='w-full border rounded px-3 py-2 mt-1'
            />
          </div>
          <div>
            <label className='text-sm font-medium'>Thumbnails</label>
            <input
              type='text'
              name='thumbnails'
              value={formData.thumbnails}
              onChange={handleChange}
              placeholder='url1, url2,...'
              className='w-full border rounded px-3 py-2 mt-1'
            />
          </div>
        </div>
      </section>

      {/* Mô tả */}
      <section className='bg-gray-50 p-4 rounded-md'>
        <h3 className='text-sm font-semibold text-gray-700 uppercase mb-4'>
          Mô tả
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='text-sm font-medium'>Mô tả</label>
            <textarea
              name='description'
              value={formData.description}
              onChange={handleChange}
              className='w-full border rounded px-3 py-2 mt-1 h-24'
            />
          </div>
          <div>
            <label className='text-sm font-medium'>Ảnh chi tiết</label>
            <input
              type='text'
              name='detailImage'
              value={formData.detailImage}
              onChange={handleChange}
              className='w-full border rounded px-3 py-2 mt-1'
            />
          </div>
        </div>
      </section>

      {/* Hiệu năng & mở rộng */}
      <section className='bg-gray-50 p-4 rounded-md'>
        <h3 className='text-sm font-semibold text-gray-700 uppercase mb-4'>
          Thông tin kỹ thuật
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='text-sm font-medium'>Hiệu năng</label>
            <textarea
              name='performance'
              value={formData.performance}
              onChange={handleChange}
              className='w-full border rounded px-3 py-2 mt-1 h-24'
            />
          </div>
          <div>
            <label className='text-sm font-medium'>Thông tin mở rộng</label>
            <textarea
              name='extends'
              value={formData.extends}
              onChange={handleChange}
              className='w-full border rounded px-3 py-2 mt-1 h-24'
            />
          </div>
        </div>
      </section>

      {/* Nút hành động */}
      <div className='flex justify-end gap-3 pt-4'>
        <button
          type='button'
          onClick={onCloseModal}
          className='px-4 py-2 rounded border border-gray-300 hover:bg-gray-100'
        >
          Hủy
        </button>
        <button
          type='button'
          className='px-4 py-2 rounded bg-black text-white hover:bg-gray-800'
        >
          Thêm sản phẩm
        </button>
      </div>
    </form>
  );
}

export default ProductForm;
