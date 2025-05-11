// import { useState } from 'react';
// import ShippingInfo from "../shipping/ShippingInfo";
// import PaymentMethods from '@/components/payment/PaymentMethods';
// import PaymentButton from '@/components/payment/PaymentButton';

function PaymentPage() {
  //   const [paymentMethod, setPaymentMethod] = useState('cod');

  //   const order = {
  //     customerName: "Nguyễn Văn A",
  //     phone: "0000000000",
  //     address: "Số ..., Đường..., Phường..., Quận,..., Thành phố",
  //     productPrice: 12000000,
  //     shippingFee: 0,
  //     discount: 500000,
  //     discountCode: "GIAMGIA500",
  //     total: 11500000
  //   };

  //   const handlePayment = () => {
  //     console.log('Selected payment method:', paymentMethod);
  //     // Xử lý thanh toán ở đây
  //   };

  return (
    <main className='min-h-screen bg-white p-4'>
      {/* <div className="max-w-[978px] mx-auto">
        <ShippingInfo order={order} />
        <PaymentMethods
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
        />
        <PaymentButton onClick={handlePayment} />
      </div> */}
    </main>
  );
}

export default PaymentPage;
