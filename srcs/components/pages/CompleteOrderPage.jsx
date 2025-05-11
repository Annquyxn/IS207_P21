import SuccessIcon from "../icons/SuccessIcon";
import VoucherBadge from "@/components/voucher/VoucherBadge";

function CompleteOrderPage() {
  const orderDetails = {
    customerName: "Nguyễn Văn A",
    phone: "0000000000",
    address: "Số ..., Đường..., Phường..., Quận,..., Thành phố",
    productPrice: 12000000,
    shippingFee: 0,
    discount: 500000,
    total: 11500000,
    deliveryEstimate: "2 - 3 ngày",
  };

  return (
    <main className="max-w-[978px] mx-auto px-4">
      {/* Success Section */}
      <section className="w-full bg-white border border-black shadow-md p-8 mt-8">
        <div className="flex flex-col items-center gap-4">
          <SuccessIcon />
          <h1 className="text-[#e40000] font-bold text-2xl md:text-[28px] mt-4 mb-0">
            Hoàn tất đặt hàng
          </h1>
          <div className="flex items-center gap-2 text-xl">
            <span className="font-bold">Dự kiến nhận hàng trong:</span>
            <span className="text-[#e40000] font-bold">
              {orderDetails.deliveryEstimate}
            </span>
          </div>
          <p className="text-xl text-center">
            Mọi thắc mắc vui lòng liên hệ bên giao dịch để được giải đáp
          </p>
        </div>
      </section>

      {/* Delivery Info Section */}
      <section className="w-full bg-white border border-black shadow-md p-8 mt-8">
        <h2 className="text-2xl font-bold mb-6">Thông tin giao hàng</h2>

        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-2 text-xl">
          <div className="font-bold">Khách hàng:</div>
          <div>{orderDetails.customerName}</div>

          <div className="font-bold">Số điện thoại:</div>
          <div>{orderDetails.phone}</div>

          <div className="font-bold">Địa chỉ nhận hàng:</div>
          <div>{orderDetails.address}</div>

          <div className="font-bold">Phí sản phẩm:</div>
          <div className="text-[#e40000] font-bold">
            {orderDetails.productPrice.toLocaleString()}đ
          </div>

          <div className="font-bold">Phí vận chuyển:</div>
          <div className="font-bold">
            {orderDetails.shippingFee.toLocaleString()}đ
          </div>

          <div className="font-bold">Giảm giá:</div>
          <div className="flex items-center gap-4">
            <span className="font-bold">
              -{orderDetails.discount.toLocaleString()}đ
            </span>
            <VoucherBadge />
          </div>

          <div className="font-bold text-[22px]">Tổng tiền</div>
          <div className="text-[#e40000] font-bold text-2xl">
            {orderDetails.total.toLocaleString()}đ
          </div>
        </div>
      </section>
    </main>
  );
}

export default CompleteOrderPage;
