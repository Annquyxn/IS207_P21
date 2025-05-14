import React, { useState } from 'react';

const ExpandSection = () => {
  const [expanded, setExpanded] = useState(false);

  const handleExpand = () => {
    setExpanded(true);
  };

  return (
    <div className={`relative mt-10 text-center overflow-hidden ${expanded ? 'expanded' : ''}`}>
      {!expanded && (
        <>
          <div className="absolute top-[-80px] left-0 right-0 h-[100px] bg-gradient-to-t from-white via-gray-200/50 pointer-events-none"></div>
          <button 
            onClick={handleExpand}
            className="bg-black text-white border-none px-6 py-3 text-base font-bold rounded-lg cursor-pointer inline-flex items-center gap-2 z-10 relative hover:bg-gray-800 transition-colors"
          >
            <i className="ti ti-chevron-down"></i> Xem thêm
          </button>
        </>
      )}

      {expanded && (
        <div className="mt-6 animate-fadeIn">
          <h3 className="text-lg mt-4 mb-2">Thông số kỹ thuật bổ sung</h3>
          <p className="leading-relaxed">
            Đây là phần nội dung thêm. Bạn có thể ghi thông số kỹ thuật chi tiết hơn, các hình ảnh khác hoặc đánh giá từ chuyên gia tại đây. Khi người dùng nhấn "Xem thêm", phần này sẽ hiện ra đầy đủ.
          </p>
        </div>
      )}
    </div>
  );
};

export default ExpandSection;