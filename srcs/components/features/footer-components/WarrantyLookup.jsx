const WarrantyLookup = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-blue-800 mb-6">
        Trung tâm hỗ trợ tra cứu thông tin bảo hành sản phẩm chính hãng
      </h1>

      <div className="flex space-x-4 mb-6">
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Tra cứu phiếu bảo hành
        </button>
        <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
          Tra cứu MRI
        </button>
      </div>

      <div className="mb-8">
        <p className="mb-4">
          Quý khách vui lòng nhập cả 2 trường thông tin (bắt buộc) để tra cứu
          trạng thái của phiếu bảo hành.
        </p>

        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Số điện thoại
              </label>
              <input type="text" className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Mã phiếu bảo hành
              </label>
              <input type="text" className="w-full p-2 border rounded" />
            </div>
            <div className="flex items-end">
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Tra cứu
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <p className="mb-4">
          GEARVN xin lỗi vì sự cố khiến thiết bị của Quý khách bị hỏng phải đi
          bảo hành. Để thuận tiện trong thời gian bảo hành sản phẩm, GEARVN cung
          cấp các thông tin địa chỉ bảo hành chính hãng để tiết kiệm thời gian.
        </p>

        <h2 className="text-xl font-semibold text-blue-700 mb-4">
          Tại khu vực miền Nam Quý khách vui lòng tra cứu thông tin bảo hành
          theo bảng này:
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Hãng/Nhà cung cấp</th>
                <th className="border p-2">Tên TTBH</th>
                <th className="border p-2">Liên Hệ</th>
                <th className="border p-2">Địa chỉ</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">GVN</td>
                <td className="border p-2">TTBH GEARVN</td>
                <td className="border p-2">1300.6975 - Nhánh 2</td>
                <td className="border p-2">TTBH KV Miền Nam</td>
              </tr>
              <tr>
                <td className="border p-2">LG</td>
                <td className="border p-2">TTBH LG QUẬN 1</td>
                <td className="border p-2">18001503</td>
                <td className="border p-2">Số 55, Sương Nguyệt Ánh</td>
              </tr>
              <tr>
                <td className="border p-2">SONY</td>
                <td className="border p-2">TTBH SONY</td>
                <td className="border p-2">180058885</td>
                <td className="border p-2">163 Quang Trung</td>
              </tr>
              <tr>
                <td className="border p-2">ASUS</td>
                <td className="border p-2">TTBH ASUS</td>
                <td className="border p-2">18006588</td>
                <td className="border p-2">EversCrow - The Manor, TP.HCM</td>
              </tr>
              <tr>
                <td className="border p-2">DELL</td>
                <td className="border p-2">TTBH DELL</td>
                <td className="border p-2">023 3842 4342</td>
                <td className="border p-2">23 Nguyễn Thị Minh Khai</td>
              </tr>
              <tr>
                <td className="border p-2">MSI</td>
                <td className="border p-2">TTBH MSI LINH KIỆN</td>
                <td className="border p-2">028 66732331</td>
                <td className="border p-2">133716 Huỳnh Tấn Phát</td>
              </tr>
              <tr>
                <td className="border p-2">ZOTAC</td>
                <td className="border p-2">TTBH ZOTAC</td>
                <td className="border p-2">0987235669</td>
                <td className="border p-2">6913 Nguyễn Cửu Đàm</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WarrantyLookup;
