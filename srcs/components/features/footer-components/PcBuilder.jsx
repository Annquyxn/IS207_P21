const PcBuilder = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-blue-800 mb-6">Build PC</h1>
      <p className="mb-6">
        Chọn các linh kiện máy tính bạn cần để xây dựng cấu hình máy
      </p>

      <div className="flex justify-between mb-8">
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Chọn lại từ đầu
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100">
            Xem và in
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100">
            Chia sẻ cấu hình
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100">
            Tải file cấu hình
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        <div className="w-2/3">
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="border p-4 rounded-lg hover:shadow-md cursor-pointer">
              <h3 className="font-medium mb-2">CPU</h3>
              <p className="text-sm text-gray-600">Chọn bộ vi xử lý</p>
            </div>
            <div className="border p-4 rounded-lg hover:shadow-md cursor-pointer">
              <h3 className="font-medium mb-2">Mainboard</h3>
              <p className="text-sm text-gray-600">Chọn bo mạch chủ</p>
            </div>
            <div className="border p-4 rounded-lg hover:shadow-md cursor-pointer">
              <h3 className="font-medium mb-2">Card màn hình</h3>
              <p className="text-sm text-gray-600">Chọn GPU</p>
            </div>
            <div className="border p-4 rounded-lg hover:shadow-md cursor-pointer">
              <h3 className="font-medium mb-2">RAM</h3>
              <p className="text-sm text-gray-600">Chọn bộ nhớ</p>
            </div>
            <div className="border p-4 rounded-lg hover:shadow-md cursor-pointer">
              <h3 className="font-medium mb-2">Ổ cứng SSD</h3>
              <p className="text-sm text-gray-600">Chọn SSD</p>
            </div>
            <div className="border p-4 rounded-lg hover:shadow-md cursor-pointer">
              <h3 className="font-medium mb-2">Ổ cứng HDD</h3>
              <p className="text-sm text-gray-600">Chọn HDD</p>
            </div>
            <div className="border p-4 rounded-lg hover:shadow-md cursor-pointer">
              <h3 className="font-medium mb-2">Case máy tính</h3>
              <p className="text-sm text-gray-600">Chọn vỏ case</p>
            </div>
            <div className="border p-4 rounded-lg hover:shadow-md cursor-pointer">
              <h3 className="font-medium mb-2">Nguồn máy tính</h3>
              <p className="text-sm text-gray-600">Chọn PSU</p>
            </div>
            <div className="border p-4 rounded-lg hover:shadow-md cursor-pointer">
              <h3 className="font-medium mb-2">Tản nhiệt CPU</h3>
              <p className="text-sm text-gray-600">Chọn CPU Cooler</p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Giá chưa bao gồm ưu đãi Build PC. Xem chi tiết
            </p>
          </div>
        </div>

        <div className="w-1/3">
          <div className="border p-6 rounded-lg bg-gray-50">
            <h2 className="text-xl font-bold mb-4">Tạm tính:</h2>
            <div className="text-2xl font-bold text-red-600 mb-6">0 đ</div>

            <button className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mb-4">
              Bạn cần thắc mắc về cấu hình?
            </button>
            <button className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Liên hệ tư vấn viên
            </button>

            <div className="mt-8 space-y-4">
              <div className="border p-4 rounded-lg">
                <h3 className="font-bold mb-2">PC MAY BỘ GEARVN</h3>
                <p className="text-sm mb-2">
                  MIỄN PHÍ VỆ SINH - THU CŨ ĐỔI MỚI
                </p>
                <div className="flex justify-between items-center">
                  <span className="font-bold">3.990.000đ</span>
                  <span className="text-green-600 font-medium">TRẢ GÓP 0%</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-bold mb-2">Câu hỏi thường gặp:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li className="text-sm">MÁY TÍNH ĐỒNG BỘ</li>
                <li className="text-sm">TRẢ GÓP 1%</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PcBuilder;
