import { useState } from 'react';

const ExpandSection = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className='mt-10 relative text-center'>
      {!expanded && (
        <button
          onClick={() => setExpanded(true)}
          className='mt-4 px-6 py-3 text-white bg-gray-800 rounded-full font-semibold hover:bg-gray-700 transition'
        >
          Xem thêm thông tin
        </button>
      )}

      {expanded && (
        <div className='mt-6 text-left bg-gray-50 p-6 rounded-xl shadow-inner'>
          <h3 className='text-lg font-bold mb-2'>Thông số kỹ thuật bổ sung</h3>
          <p className='text-gray-700 leading-relaxed mb-4'>
            Đây là phần nội dung thêm. Bạn có thể ghi thông số kỹ thuật chi tiết
            hơn, hình ảnh khác hoặc đánh giá từ chuyên gia tại đây...
          </p>

          <div className='text-center'>
            <button
              onClick={() => setExpanded(false)}
              className='mt-4 px-6 py-2 text-sm text-gray-600 hover:text-white hover:bg-gray-700 border border-gray-400 rounded-full transition'
            >
              Thu gọn
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpandSection;
