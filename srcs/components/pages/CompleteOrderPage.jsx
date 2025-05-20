import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SuccessIcon from '@/components/features/icons/SuccessIcon';
import VoucherBadge from '../ui/VoucherBadge';
import { FaUser, FaPhone, FaMapMarkerAlt, FaBox, FaTruck, FaTag, FaCheckCircle, FaArrowLeft, 
         FaCreditCard, FaMoneyBillWave, FaWallet, FaLock, FaCcVisa, FaCcMastercard,
         FaQrcode, FaSpinner, FaDownload, FaExclamationCircle } from 'react-icons/fa';
import { useNotifications } from '@/components/features/notify/NotificationContext';

// Format price to VND
const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " ₫";
};

// QR Code Component for payment methods
const PaymentQRCode = ({ orderDetails, visible }) => {
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiUrl, setApiUrl] = useState('http://127.0.0.1:8000'); // Sử dụng 127.0.0.1 thay vì localhost
  const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, processing, completed, failed
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const { orderSuccess } = useNotifications();

  useEffect(() => {
    // Debug logs
    console.log("PaymentQRCode component:", { 
      visible, 
      paymentIcon: orderDetails?.paymentIcon,
      orderNumber: orderDetails?.orderNumber,
      total: orderDetails?.total
    });
    
    if (!visible || !orderDetails || !orderDetails.paymentIcon) {
      return;
    }
    
    // Remove the check for cod since we want to handle that separately
    if (orderDetails.paymentIcon === 'cod') {
      console.log("COD payment detected, not showing QR code");
      return;
    }

    const fetchQrCode = async () => {
      setLoading(true);
      setError(null);
      try {
        // Determine which API endpoint to use based on payment method
        const endpoint = orderDetails.paymentIcon === 'bank' 
          ? '/mbqr' 
          : orderDetails.paymentIcon === 'wallet' 
            ? '/momoqr'
            : null;

        if (!endpoint) {
          throw new Error('Unsupported payment method');
        }

        console.log("Fetching QR code from endpoint:", `${apiUrl}${endpoint}`);
        
        const response = await fetch(`${apiUrl}${endpoint}?amount=${orderDetails.total}&order_id=${orderDetails.orderNumber}`);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to generate QR code. Status: ${response.status}, Details: ${errorText}`);
        }
        const data = await response.json();
        console.log("QR code data received:", data);
        setQrData(data);
        setPaymentStatus('pending'); // Đặt trạng thái chờ thanh toán
      } catch (err) {
        console.error('Error fetching QR code:', err);
        setError(err.message);
        setPaymentStatus('failed');
        
        // Try alternative URLs if the default fails
        if (apiUrl === 'http://127.0.0.1:8000') {
          console.log("Trying alternative API URL");
          setApiUrl('http://localhost:8000');
          // We'll let the effect run again with the new URL
        }
      } finally {
        setLoading(false);
      }
    };

    fetchQrCode();
  }, [visible, orderDetails, apiUrl]);
  
  // Mock payment completion - trong thực tế sẽ cần một API webhook để xác nhận thanh toán
  const simulatePaymentCompletion = () => {
    setPaymentStatus('processing');
    // Giả lập xử lý thanh toán mất 2 giây
    setTimeout(() => {
      setPaymentStatus('completed');
      setShowPaymentSuccess(true);
      // Thông báo thanh toán thành công
      orderSuccess(`Thanh toán #${orderDetails.orderNumber} thành công!`);
      // Sau 3 giây sẽ tự động chuyển đến trang hoàn thành (trong thực tế sẽ là redirect)
      setTimeout(() => {
        console.log("Payment completed, would redirect to confirmation page");
        // Trong thực tế: window.location.href = '/order-confirmation';
      }, 3000);
    }, 2000);
  };

  // Helper function to get payment method name
  const getPaymentName = () => {
    if (orderDetails.paymentIcon === 'bank') return 'MBBank';
    if (orderDetails.paymentIcon === 'wallet') return 'Momo';
    return '';
  };
  
  if (!visible || orderDetails.paymentIcon === 'cod') {
    return null;
  }
  
  // Hiển thị thông báo thanh toán thành công
  if (showPaymentSuccess) {
    return (
      <div className="mt-5 rounded-xl bg-green-50 p-6 shadow-lg border border-green-200 overflow-hidden transition-all duration-500 animate-pulse">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-500 mb-4">
            <FaCheckCircle size={30} />
          </div>
          <h3 className="text-xl font-bold text-green-700 mb-2">
            Thanh toán thành công!
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Đơn hàng của bạn đã được xác nhận và đang được xử lý.
          </p>
          <div className="text-xs text-gray-500 animate-pulse">
            Đang chuyển hướng đến trang xác nhận đơn hàng...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-5 rounded-xl bg-white p-5 shadow-lg border border-gray-200 overflow-hidden transition-all duration-300">
      <div className="text-center mb-4">
        <h3 className="font-bold text-gray-800 mb-1 flex items-center justify-center gap-2">
          <FaQrcode className="text-blue-600" /> 
          Mã QR thanh toán {getPaymentName()}
        </h3>
        <p className="text-sm text-gray-500">
          Quét mã QR để thanh toán {formatPrice(orderDetails.total)} qua {getPaymentName()}
        </p>
      </div>

      <div className="flex flex-col items-center">
        {loading && (
          <div className="flex flex-col items-center justify-center h-64">
            <FaSpinner className="animate-spin text-blue-500 text-3xl mb-2" />
            <p className="text-sm text-gray-500">Đang tạo mã QR...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center h-64 text-red-500">
            <FaExclamationCircle className="text-3xl mb-2" />
            <p className="text-sm">Không thể tạo mã QR. Vui lòng thử lại sau.</p>
            <p className="text-xs mt-1 max-w-md text-center opacity-75">{error}</p>
            <div className="flex gap-2 mt-4">
              <button 
                onClick={() => window.location.reload()}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm"
              >
                Tải lại trang
              </button>
              <button 
                onClick={() => setApiUrl(apiUrl === 'http://127.0.0.1:8000' ? 'http://localhost:8000' : 'http://127.0.0.1:8000')}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-1"
              >
                <FaSpinner className="animate-spin" />
                Thử lại
              </button>
            </div>
            <p className="text-xs mt-4 text-gray-500">
              Nếu lỗi vẫn tiếp tục, vui lòng liên hệ hỗ trợ qua hotline: 1900 1234
            </p>
          </div>
        )}

        {!loading && !error && qrData && (
          <div className="flex flex-col items-center">
            <div className="bg-white p-4 rounded-lg border-2 border-blue-200 mb-4">
              <img 
                src={`data:image/png;base64,${qrData.qr_image_base64}`} 
                alt="QR Code Payment" 
                className="w-64 h-64 object-contain" 
              />
            </div>
            
            <div className="w-full">
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-gray-600">Số tiền:</span>
                <span className="font-bold text-blue-600">{formatPrice(qrData.amount)}</span>
              </div>
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-gray-600">Nội dung:</span>
                <span className="font-medium">{qrData.note}</span>
              </div>
              
              {orderDetails.paymentIcon === 'bank' && (
                <div className="flex justify-between items-center text-sm mb-4">
                  <span className="text-gray-600">Ngân hàng:</span>
                  <span className="font-medium">MBBank</span>
                </div>
              )}

              {/* Trạng thái thanh toán */}
              <div className="flex items-center justify-center mb-4">
                {paymentStatus === 'pending' && (
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium">
                    Đang chờ thanh toán...
                  </span>
                )}
                {paymentStatus === 'processing' && (
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <FaSpinner className="animate-spin" /> Đang xử lý...
                  </span>
                )}
                {paymentStatus === 'completed' && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                    Đã thanh toán
                  </span>
                )}
                {paymentStatus === 'failed' && (
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">
                    Thanh toán thất bại
                  </span>
                )}
              </div>
              
              <button 
                onClick={() => {
                  // Download QR code as image
                  const link = document.createElement('a');
                  link.href = `data:image/png;base64,${qrData.qr_image_base64}`;
                  link.download = `payment-qr-${orderDetails.orderNumber}.png`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg transition-colors mt-2"
              >
                <FaDownload /> Tải mã QR
              </button>
              
              {orderDetails.paymentIcon === 'wallet' && qrData.momo_uri && (
                <a 
                  href={qrData.momo_uri}
                  className="w-full flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-3 rounded-lg transition-colors mt-3"
                >
                  <FaWallet /> Mở ứng dụng Momo
                </a>
              )}
              
              {orderDetails.paymentIcon === 'bank' && qrData.mb_link && (
                <a 
                  href={qrData.mb_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg transition-colors mt-3"
                >
                  <FaCreditCard /> Mở MBBank
                </a>
              )}
              
              {/* Nút mô phỏng thanh toán thành công - trong thực tế thì không cần */}
              <button
                onClick={simulatePaymentCompletion}
                className="w-full flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-800 text-white px-4 py-3 rounded-lg transition-colors mt-3"
              >
                <FaCheckCircle /> Xác nhận đã thanh toán
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function CompleteOrderPage() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [activePaymentDetails, setActivePaymentDetails] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { orderSuccess } = useNotifications();
  
  // Lấy thông tin đơn hàng từ location state
  const { orderInfo } = location.state || {};
  
  // Debug logs to check what payment method is being passed
  console.log("Order Info:", orderInfo);
  console.log("Payment Method:", orderInfo?.paymentMethod);
  
  // Tạo hoặc lấy mã đơn hàng từ sessionStorage
  // Sử dụng sessionKey để đảm bảo đơn hàng mới sẽ có mã khác khi quay lại trang đặt hàng
  const sessionKey = 'currentOrderNumber';
  let orderNumber = sessionStorage.getItem(sessionKey);
  
  if (!orderNumber && orderInfo) {
    orderNumber = orderInfo.id || "DH" + Math.floor(Math.random() * 1000000);
    sessionStorage.setItem(sessionKey, orderNumber);
  }
  
  // Kiểm tra nếu không có thông tin đơn hàng, chuyển hướng về trang chủ
  useEffect(() => {
    if (!orderInfo) {
      navigate('/');
    }
  }, [orderInfo, navigate]);
  
  // Xây dựng đối tượng orderDetails từ orderInfo
  const orderDetails = orderInfo ? {
    orderNumber: orderNumber || "Đang xử lý",
    customerName: orderInfo.addressData?.fullName || 'Khách hàng',
    phone: orderInfo.addressData?.phone || '0000000000',
    address: orderInfo.addressData?.fullAddress || 
      `${orderInfo.addressData?.street || ''}, ${orderInfo.addressData?.wardName || orderInfo.addressData?.ward || ''}, ${orderInfo.addressData?.districtName || orderInfo.addressData?.district || ''}, ${orderInfo.addressData?.cityName || orderInfo.addressData?.city || ''}`,
    productPrice: parsePrice(orderInfo.product?.salePrice) * (orderInfo.product?.quantity || 1),
    shippingFee: orderInfo.addressData ? calculateShippingFee(orderInfo.addressData.shippingMethod, parsePrice(orderInfo.product?.salePrice)) : 0,
    discount: orderInfo.discount?.amount || 0,
    total: calculateTotal(
      parsePrice(orderInfo.product?.salePrice) * (orderInfo.product?.quantity || 1),
      orderInfo.addressData ? calculateShippingFee(orderInfo.addressData.shippingMethod, parsePrice(orderInfo.product?.salePrice)) : 0,
      orderInfo.discount?.amount || 0
    ),
    deliveryEstimate: orderInfo.addressData?.shippingMethod === 'express' ? '1 - 2 ngày' : '2 - 3 ngày',
    orderDate: new Date().toLocaleDateString('vi-VN'),
    paymentMethod: getPaymentMethodName(orderInfo.paymentMethod),
    // Make sure paymentIcon is correctly set here
    paymentIcon: orderInfo.paymentMethod || 'cod',
    discountCode: orderInfo.discount?.code || '',
    productInfo: orderInfo.product || {}
  } : null;
  
  // Debug log to check final orderDetails
  console.log("Final orderDetails:", {
    paymentMethod: orderDetails?.paymentMethod,
    paymentIcon: orderDetails?.paymentIcon
  });

  // Hàm chuyển đổi giá sản phẩm từ chuỗi sang số
  function parsePrice(priceStr) {
    if (!priceStr) return 0;
    return parseInt(priceStr.replace(/[^\d]/g, ''));
  }
  
  // Hàm tính phí vận chuyển
  function calculateShippingFee(shippingMethod, productPrice) {
    if (productPrice >= 500000) return 0; // Miễn phí với đơn >= 500K
    return shippingMethod === 'express' ? 50000 : 30000;
  }
  
  // Hàm tính tổng tiền
  function calculateTotal(productPrice, shippingFee, discount) {
    return productPrice + shippingFee - discount;
  }
  
  // Hàm lấy tên phương thức thanh toán
  function getPaymentMethodName(paymentMethod) {
    switch(paymentMethod) {
      case 'bank': return 'Chuyển khoản ngân hàng';
      case 'wallet': return 'Thanh toán qua ví điện tử';
      case 'cod':
      default: return 'Thanh toán khi nhận hàng';
    }
  }

  // Get payment method icon based on payment type
  const getPaymentIcon = () => {
    switch(orderDetails?.paymentIcon) {
      case 'bank':
        return <FaCreditCard className="text-blue-600" />;
      case 'wallet':
        return <FaWallet className="text-purple-600" />;
      case 'cod':
      default:
        return <FaMoneyBillWave className="text-green-600" />;
    }
  };
  
  // Get payment method color scheme
  const getPaymentColorScheme = () => {
    switch(orderDetails?.paymentIcon) {
      case 'bank':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          border: 'border-blue-300',
          icon: 'text-blue-600'
        };
      case 'wallet':
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
      
      // Show QR code for bank and wallet payments
      if (orderDetails) {
        console.log("Setting QR code visibility based on payment method:", orderDetails.paymentIcon);
        // Always check both possible values to avoid any case issues
        if (orderDetails.paymentIcon === 'bank' || orderDetails.paymentIcon === 'wallet') {
          setShowQRCode(true);
          console.log("QR code visibility set to true for payment method:", orderDetails.paymentIcon);
        }
      }
    }, 1000);
    
    // Thêm thông báo đặt hàng thành công nếu có thông tin đơn hàng và mã đơn hàng
    if (orderDetails && orderNumber) {
      orderSuccess(orderNumber);
    }
    
    return () => {
      clearTimeout(timer);
      clearTimeout(paymentTimer);
    }
  }, []);

  // Get color scheme
  const paymentColors = getPaymentColorScheme();

  // Nếu không có thông tin đơn hàng, hiển thị màn hình loading
  if (!orderDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Đang tải thông tin đơn hàng...</p>
      </div>
    );
  }

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

        {/* Product Info Section */}
        <section className='bg-white rounded-3xl shadow-xl p-8 mb-8 transform transition-all duration-500 hover:shadow-2xl'>
          <div className='flex items-center justify-between border-b pb-4 mb-6'>
            <h2 className='text-xl font-bold text-gray-800 flex items-center gap-2'>
              <FaBox className="text-blue-600" /> Thông tin sản phẩm
            </h2>
          </div>
          
          <div className="flex gap-4 items-start mb-6">
            <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200 shadow-sm">
              <img
                src={orderDetails.productInfo.image}
                alt={orderDetails.productInfo.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-800 line-clamp-2">
                {orderDetails.productInfo.title}
              </h3>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm font-bold text-red-600">
                  {orderDetails.productInfo.salePrice}
                </span>
                {orderDetails.productInfo.originalPrice && (
                  <span className="text-xs text-gray-500 line-through">
                    {orderDetails.productInfo.originalPrice}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                <span>Số lượng: {orderDetails.productInfo.quantity || 1}</span>
              </div>
            </div>
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
              onClick={() => {
                setActivePaymentDetails(!activePaymentDetails);
                setShowQRCode(!showQRCode);
                // Debug log when clicking on payment method badge
                console.log("Payment method clicked:", {
                  paymentMethod: orderDetails.paymentMethod,
                  paymentIcon: orderDetails.paymentIcon,
                  showQRCode: !showQRCode
                });
              }}
            >
              <div className="payment-card">
                <div className="flex items-center gap-2">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full bg-white ${paymentColors.icon}`}>
                    {getPaymentIcon()}
                  </div>
                  <div>
                    <p className="text-xs font-medium">Phương thức thanh toán</p>
                    <p className="text-sm font-bold">{orderDetails.paymentMethod}</p>
                    {/* Debug info on payment method */}
                    <p className="text-xs text-gray-500 mt-1 bg-black bg-opacity-5 px-1 rounded">
                      Debug: {orderDetails.paymentIcon}
                    </p>
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
              
              {/* Show specific payment instructions based on method */}
              {orderDetails.paymentIcon === 'bank' && (
                <div className="mt-2 p-2 bg-blue-50 text-sm text-blue-800 rounded-lg">
                  <p className="font-medium">Hướng dẫn thanh toán chuyển khoản:</p>
                  <p>1. Quét mã QR bên dưới bằng app ngân hàng</p>
                  <p>2. Kiểm tra thông tin và xác nhận thanh toán</p>
                  <p>3. Đơn hàng sẽ được xác nhận tự động</p>
                </div>
              )}
              
              {orderDetails.paymentIcon === 'wallet' && (
                <div className="mt-2 p-2 bg-purple-50 text-sm text-purple-800 rounded-lg">
                  <p className="font-medium">Hướng dẫn thanh toán qua Momo:</p>
                  <p>1. Quét mã QR bên dưới bằng app MoMo</p>
                  <p>2. Hoặc nhấn nút "Mở ứng dụng Momo" bên dưới</p>
                  <p>3. Kiểm tra thông tin và xác nhận thanh toán</p>
                </div>
              )}
              
              <div className="text-sm text-gray-600 italic mt-2 text-center">
                Giao dịch của bạn được mã hóa và bảo mật 100%
              </div>
            </div>
          )}

          {/* QR Code for payment */}
          {(orderDetails.paymentIcon === 'bank' || orderDetails.paymentIcon === 'wallet') && (
            <PaymentQRCode orderDetails={orderDetails} visible={showQRCode} />
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

            {orderDetails.discount > 0 && (
              <div className='flex justify-between items-center bg-gray-50 p-3 rounded-lg'>
                <div className='flex items-center gap-3 text-gray-700'>
                  <FaTag className="text-gray-500" /> Giảm giá
                </div>
                <div className='flex items-center gap-3'>
                  <span className='font-medium text-green-600'>
                    -{formatPrice(orderDetails.discount)}
                  </span>
                  {orderDetails.discountCode && <VoucherBadge code={orderDetails.discountCode} color="#E1F5FE" />}
                </div>
              </div>
            )}

            <div className='flex justify-between items-center p-4 mt-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100'>
              <div className='font-bold text-gray-800'>Tổng thanh toán</div>
              <div className='text-lg font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent'>
                {formatPrice(orderDetails.total)}
              </div>
            </div>
            
            {/* Thông tin chuyển khoản/ví điện tử nếu có */}
            {(orderDetails.paymentIcon === 'bank' || orderDetails.paymentIcon === 'wallet') && (
              <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-blue-100">
                <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                  {orderDetails.paymentIcon === 'bank' ? (
                    <><FaCreditCard className="text-blue-600" /> Thông tin thanh toán MBBank</>
                  ) : (
                    <><FaWallet className="text-purple-600" /> Thông tin thanh toán Momo</>
                  )}
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tài khoản:</span>
                    <span className="font-medium">0982685374</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Chủ tài khoản:</span>
                    <span className="font-medium">DANG THIEN AN</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Số tiền:</span>
                    <span className="font-bold text-blue-600">{formatPrice(orderDetails.total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nội dung chuyển khoản:</span>
                    <span className="font-medium">ThanhToan_{orderDetails.orderNumber}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
        
        <div className="text-center">
          <button 
            className="bg-white hover:bg-gray-100 text-gray-800 font-medium py-3 px-6 rounded-full transition-all shadow-md hover:shadow-lg flex items-center gap-2 mx-auto"
            onClick={() => navigate('/home')}
          >
            <FaArrowLeft size={14} /> Quay lại trang chủ
          </button>
        </div>
      </main>
    </div>
  );
}

export default CompleteOrderPage;
