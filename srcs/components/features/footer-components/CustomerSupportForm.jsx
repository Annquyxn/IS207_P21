import React from 'react';

const CustomerSupportForm = () => {
  return (
    <div className="max-w-2xl mx-auto p-6 font-sans">
      <h1 className="text-2xl font-bold text-center mb-8">GEARVN XIN HÂN HẠNH ĐƯỢC HỖ TRỢ QUÝ KHÁCH</h1>

      <div className="space-y-6">
        {/* Phần chủ đề */}
        <section>
          <h2 className="font-medium mb-3">Quý khách đang quan tâm về:</h2>
          <select className="w-full p-2 border rounded-md mb-4">
            <option>Chọn chủ đề</option>
          </select>
          
          <div className="space-y-2">
            <label className="block font-medium">Tiêu đề:</label>
            <input 
              type="text" 
              placeholder="Quý khách vui lòng nhập tiêu đề" 
              className="w-full p-2 border rounded-md"
            />
          </div>
        </section>

        {/* Phần nội dung */}
        <section>
          <h2 className="font-medium mb-3">Nội dung:</h2>
          <textarea 
            placeholder="Xin quý khách vui lòng mô tả chi tiết" 
            className="w-full p-2 border rounded-md h-32"
          />
        </section>

        <hr className="my-6" />

        {/* Thông tin liên hệ */}
        <section className="space-y-4">
          <div>
            <label className="block font-medium mb-2">Họ và tên:</label>
            <input 
              type="text" 
              placeholder="Nhập họ tên" 
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-2">Địa chỉ Email:</label>
              <input 
                type="email" 
                placeholder="Nhập Email" 
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            <div>
              <label className="block font-medium mb-2">Số điện thoại:</label>
              <input 
                type="tel" 
                placeholder="Nhập sđt" 
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>
        </section>

        {/* Nút gửi */}
        <button className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors">
          GỬI LIÊN HỆ
        </button>
      </div>
    </div>
  );
};

export default CustomerSupportForm;