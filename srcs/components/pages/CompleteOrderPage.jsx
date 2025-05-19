import { useState, useEffect } from 'react';
import SuccessIcon from '@/components/features/icons/SuccessIcon';
import VoucherBadge from '../ui/VoucherBadge';
import { FaUser, FaPhone, FaMapMarkerAlt, FaBox, FaTruck, FaTag, FaCheckCircle, FaArrowLeft, 
         FaCreditCard, FaMoneyBillWave, FaWallet, FaLock, FaCcVisa, FaCcMastercard } from 'react-icons/fa';

function CompleteOrderPage() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [activePaymentDetails, setActivePaymentDetails] = useState(false);
  
  const orderDetails = {
    orderNumber: "DH123456789",
    customerName: 'Nguyễn Văn A',
    phone: '0000000000',
    address: 'Số ..., Đường..., Phường..., Quận,..., Thành phố',
    productPrice: 12000000,
    shippingFee: 0,
    discount: 500000,
    total: 11500000,
    deliveryEstimate: '2 - 3 ngày',
    orderDate: '10/08/2023',
    paymentMethod: 'Thanh toán khi nhận hàng',
    paymentIcon: 'cod', // 'cod', 'bank', 'e-wallet'
  };

  // Format price to VND
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " ₫";
  };
  
  // Get payment method icon based on payment type
  const getPaymentIcon = () => {
    switch(orderDetails.paymentIcon) {
      case 'bank':
        return <FaCreditCard className="text-blue-600" />;
      case 'e-wallet':
        return <FaWallet className="text-purple-600" />;
      case 'cod':
      default:
        return <FaMoneyBillWave className="text-green-600" />;
    }
  };
  
  // Get payment method color scheme
  const getPaymentColorScheme = () => {
    switch(orderDetails.paymentIcon) {
      case 'bank':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          border: 'border-blue-300',
          icon: 'text-blue-600'
        };
      case 'e-wallet':
        return {
          bg: 'bg-purple-100',
          text: 'text-purple-800',
          border: 'border-purple-300',
          icon: 'text-purple-600'
        };
      case 'cod':
      default:
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          border: 'border-green-300',
          icon: 'text-green-600'
        };
    }
  };
  
  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    
    // Animate payment details after a delay
    const paymentTimer = setTimeout(() => {
      setActivePaymentDetails(true);
    }, 1000);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(paymentTimer);
    }
  }, []);

  // Get color scheme
  const paymentColors = getPaymentColorScheme();

  return (
    <div className='min-h-screen bg-gradient-to-b from-blue-50 to-white py-10 px-4'>
      {showConfetti && (
        <div className="confetti-container fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div 
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-5%`,
                backgroundColor: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'][Math.floor(Math.random() * 6)],
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                animation: `fall ${Math.random() * 3 + 2}s linear forwards, sway ${Math.random() * 2 + 3}s ease-in-out infinite alternate`
              }}
            />
          ))}
        </div>
      )}
      
      <style jsx>{`
        @keyframes fall {
          to {
            transform: translateY(100vh);
            opacity: 0;
          }
        }
        @keyframes sway {
          from {
            transform: translateX(-5px) rotate(-10deg);
          }
          to {
            transform: translateX(5px) rotate(10deg);
          }
        }
        .confetti {
          position: absolute;
          opacity: 0.7;
          border-radius: 50%;
        }
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse-border {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4);
          }
          50% {
            box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.4);
          }
        }
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        .payment-method-badge {
          animation: float 5s ease-in-out infinite;
        }
        .payment-details {
          animation: fadeSlideIn 0.8s ease-out forwards;
        }
        .payment-card {
          perspective: 1000px;
          transition: all 0.5s ease;
        }
        .payment-card:hover {
          transform: translateY(-5px);
        }
        .payment-card-inner {
          transition: transform 0.6s;
          transform-style: preserve-3d;
          position: relative;
        }
        .payment-method-badge:hover .payment-card-inner {
          transform: rotateY(180deg);
        }
        .payment-front, .payment-back {
          backface-visibility: hidden;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .payment-back {
          transform: rotateY(180deg);
        }
      `}</style>
      
      <main className='max-w-2xl mx-auto'>
        {/* Success Section */}
        <section className='bg-white rounded-3xl shadow-2xl p-8 mb-8 transform transition-all duration-500 hover:shadow-xl border-t-4 border-green-500'>
          <div className='flex flex-col items-center gap-3 text-center'>
            <div className="relative mb-4 animate-bounce">
              <SuccessIcon />
            </div>
            <h1 className='bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent font-bold text-2xl md:text-3xl mb-2 flex items-center gap-2'>
              Đặt hàng thành công!
            </h1>
            <div className='flex flex-col gap-1 mb-3'>
              <p className='text-sm text-gray-500'>Mã đơn hàng: <span className="font-medium text-gray-700">{orderDetails.orderNumber}</span></p>
              <p className='text-sm text-gray-500'>Ngày đặt hàng: <span className="font-medium text-gray-700">{orderDetails.orderDate}</span></p>
            </div>
            <div className='inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-full text-sm font-medium shadow-md'>
              <FaTruck className="animate-pulse" /> Dự kiến nhận hàng trong: <span className='font-bold'>{orderDetails.deliveryEstimate}</span>
            </div>
            <p className='text-xs text-gray-500 mt-4 max-w-md'>
              Chúng tôi sẽ liên hệ với bạn qua số điện thoại đã đăng ký để xác nhận đơn hàng. Cảm ơn bạn đã mua sắm cùng chúng tôi!
            </p>
          </div>
        </section>

        {/* Delivery Info Section */}
        <section className='bg-white rounded-3xl shadow-xl p-8 mb-8 transform transition-all duration-500 hover:shadow-2xl'>
          <div className='flex items-center justify-between border-b pb-4 mb-6'>
            <h2 className='text-xl font-bold text-gray-800 flex items-center gap-2'>
              <FaUser className="text-blue-600" /> Thông tin khách hàng
            </h2>
            
            {/* Enhanced Payment Method Badge */}
            <div 
              className={`payment-method-badge relative ${paymentColors.bg} ${paymentColors.text} px-3 py-2 rounded-lg shadow-md border ${paymentColors.border} cursor-pointer`}
              onClick={() => setActivePaymentDetails(!activePaymentDetails)}
            >
              <div className="payment-card">
                <div className="flex items-center gap-2">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full bg-white ${paymentColors.icon}`}>
                    {getPaymentIcon()}
                  </div>
                  <div>
                    <p className="text-xs font-medium">Phương thức thanh toán</p>
                    <p className="text-sm font-bold">{orderDetails.paymentMethod}</p>
                  </div>
                  <div className={`absolute -top-1 -right-1 w-3 h-3 ${paymentColors.bg} rounded-full animate-ping opacity-75`}></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Payment Details Popup */}
          {activePaymentDetails && (
            <div className="payment-details mb-6 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <FaLock className="text-green-600" /> Chi tiết thanh toán an toàn
                </h3>
                <div className="flex items-center gap-1">
                  <FaCcVisa className="text-blue-700 text-xl" />
                  <FaCcMastercard className="text-red-500 text-xl" />
                </div>
              </div>
              
              <div className="flex items-center gap-3 mb-2">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${paymentColors.bg}`}>
                  {getPaymentIcon()}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phương thức</p>
                  <p className="font-medium">{orderDetails.paymentMethod}</p>
                </div>
              </div>
              
              <div className="text-sm text-gray-600 italic mt-2 text-center">
                Giao dịch của bạn được mã hóa và bảo mật 100%
              </div>
            </div>
          )}

          <div className='space-y-5 mb-8'>
            <div className='flex items-start gap-4'>
              <div className='mt-0.5 bg-blue-100 p-2 rounded-full text-blue-600'><FaUser /></div>
              <div className='flex-1'>
                <p className='text-xs text-gray-500'>Người nhận</p>
                <p className='text-sm font-medium text-gray-800'>{orderDetails.customerName}</p>
              </div>
            </div>

            <div className='flex items-start gap-4'>
              <div className='mt-0.5 bg-green-100 p-2 rounded-full text-green-600'><FaPhone /></div>
              <div className='flex-1'>
                <p className='text-xs text-gray-500'>Số điện thoại</p>
                <p className='text-sm font-medium text-gray-800'>{orderDetails.phone}</p>
              </div>
            </div>

            <div className='flex items-start gap-4'>
              <div className='mt-0.5 bg-red-100 p-2 rounded-full text-red-600'><FaMapMarkerAlt /></div>
              <div className='flex-1'>
                <p className='text-xs text-gray-500'>Địa chỉ nhận hàng</p>
                <p className='text-sm font-medium text-gray-800'>{orderDetails.address}</p>
              </div>
            </div>
          </div>
          
          <div className='flex items-center justify-between border-b pb-4 mb-6'>
            <h2 className='text-xl font-bold text-gray-800 flex items-center gap-2'>
              <FaTag className="text-purple-600" /> Chi tiết thanh toán
            </h2>
          </div>
          
          <div className='space-y-4 text-sm'>
            <div className='flex justify-between items-center bg-gray-50 p-3 rounded-lg'>
              <div className='flex items-center gap-3 text-gray-700'>
                <FaBox className="text-gray-500" /> Tiền sản phẩm
              </div>
              <div className='font-medium'>
                {formatPrice(orderDetails.productPrice)}
              </div>
            </div>

            <div className='flex justify-between items-center bg-gray-50 p-3 rounded-lg'>
              <div className='flex items-center gap-3 text-gray-700'>
                <FaTruck className="text-gray-500" /> Phí vận chuyển
              </div>
              <div className='font-medium'>
                {formatPrice(orderDetails.shippingFee)}
              </div>
            </div>

            <div className='flex justify-between items-center bg-gray-50 p-3 rounded-lg'>
              <div className='flex items-center gap-3 text-gray-700'>
                <FaTag className="text-gray-500" /> Giảm giá
              </div>
              <div className='flex items-center gap-3'>
                <span className='font-medium text-green-600'>
                  -{formatPrice(orderDetails.discount)}
                </span>
                <VoucherBadge code="GIAMGIA500" color="#E1F5FE" />
              </div>
            </div>

            <div className='flex justify-between items-center p-4 mt-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100'>
              <div className='font-bold text-gray-800'>Tổng thanh toán</div>
              <div className='text-lg font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent'>
                {formatPrice(orderDetails.total)}
              </div>
            </div>
          </div>
        </section>
        
        <div className="text-center">
          <button 
            className="bg-white hover:bg-gray-100 text-gray-800 font-medium py-3 px-6 rounded-full transition-all shadow-md hover:shadow-lg flex items-center gap-2 mx-auto"
            onClick={() => window.history.back()}
          >
            <FaArrowLeft size={14} /> Quay lại trang chủ
          </button>
        </div>
      </main>
    </div>
  );
}

export default CompleteOrderPage;
