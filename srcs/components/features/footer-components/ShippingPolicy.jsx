import React from "react";

const ShippingPolicy = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-sans">
      <h1 className="text-2xl font-bold mb-6">Chính sách giao hàng</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          "Bảng giá thu sản phẩm củ",
          "Dịch vụ hỗ trợ kỹ thuật tại nhà",
          "Dịch vụ sửa chữa",
          "Giới thiệu",
          "Tra cứu thông tin bảo hành",
          "Chính sách giao hàng",
          "Chính sách bảo hành",
          "Thanh toán",
          "Mua hàng trả góp",
          "Hướng dẫn mua hàng",
          "Chính sách bảo mật",
          "Điều khoản dịch vụ",
          "Dịch vụ vệ sinh miễn phí",
          "Liên hệ",
        ].map((item, index) => (
          <div
            key={index}
            className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
          >
            {item}
          </div>
        ))}
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Chính sách vận chuyển</h2>
        <p className="mb-4">
          <strong>GEARVN</strong> cung cấp dịch vụ giao hàng toàn quốc, gửi hàng
          tận nơi đến địa chỉ cung cấp của Quý khách. Thời gian giao hàng dự
          kiến phụ thuộc vào kho và địa chỉ nhận hàng của Quý khách.
        </p>
        <p>
          Với đa phần đơn hàng, GEARVN cần vài giờ làm việc để kiểm tra thông
          tin và đóng gói hàng. Nếu các sản phẩm đều có sản GEARVN sẽ nhanh
          chóng bàn giao cho đối tác vận chuyển.
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Phí dịch vụ giao hàng</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Giá trị đơn hàng</th>
                <th className="border p-2">Khu vực HCM/HN</th>
                <th className="border p-2">Khu vực Ngoại thành/Tỉnh</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2 font-medium" colSpan={3}>
                  GIAO HÀNG NHANH 2H ĐẾN 4H
                </td>
              </tr>
              <tr>
                <td className="border p-2">Đơn hàng dưới 5 triệu đồng</td>
                <td className="border p-2">40.000 VND</td>
                <td className="border p-2">Không áp dụng</td>
              </tr>
              <tr>
                <td className="border p-2">Đơn hàng trên 5 triệu đồng</td>
                <td className="border p-2">Miễn phí</td>
                <td className="border p-2">Không áp dụng</td>
              </tr>
              <tr>
                <td className="border p-2 font-medium" colSpan={3}>
                  GIAO HÀNG TIÊU CHUẨN
                </td>
              </tr>
              <tr>
                <td className="border p-2">Đơn hàng dưới 5 triệu đồng</td>
                <td className="border p-2">25.000 VND</td>
                <td className="border p-2">40.000 VND</td>
              </tr>
              <tr>
                <td className="border p-2">Đơn hàng trên 5 triệu đồng</td>
                <td className="border p-2">Miễn phí</td>
                <td className="border p-2">Miễn phí</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-sm italic">
          Chính sách này có hiệu lực từ ngày 20 tháng 03 năm 2024.
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">
          Thời gian dự kiến giao hàng
        </h2>
        <p className="mb-4">
          Phụ thuộc vào kho và địa chỉ nhận hàng của Quý khách. Thời gian dự
          kiến giao hàng tiêu chuẩn như sau:
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Tuyến</th>
                <th className="border p-2">Khu vực</th>
                <th className="border p-2">Thời gian dự kiến</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2" rowSpan={2}>
                  Hồ Chí Minh – Hồ Chí Minh
                  <br />
                  Hà Nội – Hà Nội
                </td>
                <td className="border p-2">• Nội Thành</td>
                <td className="border p-2">• 1 - 2 ngày</td>
              </tr>
              <tr>
                <td className="border p-2">• Ngoại Thành</td>
                <td className="border p-2">• 1 - 2 ngày</td>
              </tr>
              <tr>
                <td className="border p-2" rowSpan={2}>
                  Hồ Chí Minh – Miền Nam
                  <br />
                  Hà Nội – Miền Bắc
                </td>
                <td className="border p-2">
                  • Trung tâm Tỉnh, Thành phố, Thị xã
                </td>
                <td className="border p-2">• 3 - 4 ngày</td>
              </tr>
              <tr>
                <td className="border p-2">• Huyện, xã</td>
                <td className="border p-2">• 4 - 5 ngày</td>
              </tr>
              <tr>
                <td className="border p-2" rowSpan={2}>
                  Hồ Chí Minh – Miền Trung
                  <br />
                  Hà Nội – Miền Trung
                </td>
                <td className="border p-2">
                  • Trung tâm Tỉnh, Thành phố, Thị xã
                </td>
                <td className="border p-2">• 4 - 6 ngày</td>
              </tr>
              <tr>
                <td className="border p-2">• Huyện, xã</td>
                <td className="border p-2">• 5 - 7 ngày</td>
              </tr>
              <tr>
                <td className="border p-2" rowSpan={2}>
                  Hồ Chí Minh – Miền Bắc
                  <br />
                  Hà Nội – Miền Nam
                </td>
                <td className="border p-2">
                  • Trung tâm Tỉnh, Thành phố, Thị xã
                </td>
                <td className="border p-2">• 5 - 7 ngày</td>
              </tr>
              <tr>
                <td className="border p-2">• Huyện, xã</td>
                <td className="border p-2">• 5 - 7 ngày</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Khu vực nội thành:</h3>
        <ul className="list-disc pl-5 mb-4">
          <li className="mb-1">
            <strong>Tp.HCM:</strong> Quận 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
            Bình Tân, Gò Vấp, Thủ Đức, Bình Thạnh, Phù Nhuận, Tân Phú, Tân Bình.
          </li>
          <li>
            <strong>Hà Nội:</strong> Hoàn Kiếm, Đống Đa, Ba Đình, Hai Bà Trưng,
            Hoàng Mai, Thanh Xuân, Tây Hồ, Cầu Giấy, Long Biên, Hà Đông, Nam Tú
            Liêm, Bắc Tú Liêm.
          </li>
        </ul>

        <h3 className="font-semibold mb-2">Lưu ý:</h3>
        <ul className="list-disc pl-5">
          <li className="mb-1">
            Trong một số trường hợp, hàng hóa không có sẵn tại kho gần nhất,
            thời gian giao hàng có thể chậm hơn so với dự kiến do điều hàng.
          </li>
          <li>
            Ngày làm việc là từ thứ hai đến thứ 6, không tính thứ 7, Chủ nhật và
            các ngày nghỉ lễ, tết, nghỉ bù, và không bao gồm các tuyến huyện đảo
            xa.
          </li>
        </ul>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <h3 className="font-semibold mb-2">MỘT SỐ LƯU Ý KHI NHẬN HÀNG</h3>
        <ul className="list-disc pl-5">
          <li className="mb-1">
            Trước khi tiến hành giao hàng cho Quý khách, Hỗ trợ kỹ thuật (HTTK)
            của GearVN hoặc bưu tá của Đối tác vận chuyển sẽ liên hệ qua số điện
            thoại của Quý khách trước khoảng 3 đến 5 phút để xác nhận giao hàng.
          </li>
          <li>
            Áp dụng cho đơn hàng giao hàng tiêu chuẩn, nếu Quý khách không thể
            có mặt trong đợt nhận hàng thứ nhất, vui lòng liên hệ với chúng tôi
            để sắp xếp thời gian giao hàng khác.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ShippingPolicy;
