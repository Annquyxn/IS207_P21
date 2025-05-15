import SuccessIcon from '@/components/features/icons/SuccessIcon';
import VoucherBadge from '../ui/VoucherBadge';

function CompleteOrderPage() {
  const orderDetails = {
    customerName: 'Nguyễn Văn A',
    phone: '0000000000',
    address: 'Số ..., Đường..., Phường..., Quận,..., Thành phố',
    productPrice: 12000000,
    shippingFee: 0,
    discount: 500000,
    total: 11500000,
    deliveryEstimate: '2 - 3 ngày',
  };

  return (
    <main className='max-w-[978px] mx-auto px-4 pb-12'>
      {/* Success Section */}
      <section className='w-full bg-white border border-black shadow-md rounded-xl p-8 mt-8'>
        <div className='flex flex-col items-center gap-3 text-center'>
          <SuccessIcon />
          <h1 className='text-[#e40000] font-bold text-2xl md:text-[28px]'>
            Hoàn tất đặt hàng
          </h1>
          <div className='flex flex-col sm:flex-row items-center gap-1 text-lg'>
            <span className='font-semibold'>Dự kiến nhận hàng trong:</span>
            <span className='text-[#e40000] font-bold'>
              {orderDetails.deliveryEstimate}
            </span>
          </div>
          <p className='text-base text-gray-700 mt-2'>
            Mọi thắc mắc vui lòng liên hệ bên giao dịch để được giải đáp
          </p>
        </div>
      </section>

      {/* Delivery Info Section */}
      <section className='w-full bg-white border border-black shadow-md rounded-xl p-8 mt-8'>
        <h2 className='text-xl md:text-2xl font-bold mb-6 text-center'>
          Thông tin giao hàng
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-[200px_1fr] gap-y-4 gap-x-2 text-[17px]'>
          <div className='font-semibold'>Khách hàng:</div>
          <div>{orderDetails.customerName}</div>

          <div className='font-semibold'>Số điện thoại:</div>
          <div>{orderDetails.phone}</div>

          <div className='font-semibold'>Địa chỉ nhận hàng:</div>
          <div>{orderDetails.address}</div>

          <div className='font-semibold'>Phí sản phẩm:</div>
          <div className='text-[#e40000] font-bold'>
            {orderDetails.productPrice.toLocaleString()}đ
          </div>

          <div className='font-semibold'>Phí vận chuyển:</div>
          <div className='font-bold'>
            {orderDetails.shippingFee.toLocaleString()}đ
          </div>

          <div className='font-semibold'>Giảm giá:</div>
          <div className='flex items-center gap-3'>
            <span className='font-bold text-[#15803d]'>
              -{orderDetails.discount.toLocaleString()}đ
            </span>
            <VoucherBadge />
          </div>

          <div className='font-bold text-[20px] md:text-[22px]'>Tổng tiền</div>
          <div className='text-[#e40000] font-bold text-[22px] md:text-[26px]'>
            {orderDetails.total.toLocaleString()}đ
          </div>
        </div>
      </section>
    </main>
  );
}

export default CompleteOrderPage;
