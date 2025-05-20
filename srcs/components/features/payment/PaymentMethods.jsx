import { FaCreditCard, FaMoneyBillWave, FaWallet, FaQrcode, FaDownload, FaSpinner, FaExclamationCircle } from 'react-icons/fa';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

function PaymentMethods({ paymentMethod, setPaymentMethod, orderInfo }) {
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiUrl, setApiUrl] = useState('http://127.0.0.1:8000'); // Sử dụng 127.0.0.1 thay vì localhost
  const [refreshInterval, setRefreshInterval] = useState(null);

  // Format price to VND
  const formatPrice = (price) => {
    if (!price && price !== 0) return "0 ₫";
    
    try {
      // Convert to string if it's a number
      const priceStr = typeof price === 'number' ? price.toString() : price;
      // Remove non-digit characters if it's a string
      const numericPrice = priceStr.replace ? parseInt(priceStr.replace(/[^\d]/g, '')) : parseInt(priceStr);
      return numericPrice.toLocaleString('vi-VN') + " ₫";
    } catch (error) {
      console.error('Error formatting price:', error, price);
      return (price || 0) + " ₫";
    }
  };

  const methods = [
    { 
      id: "cod", 
      label: "Thanh toán khi nhận hàng", 
      icon: <FaMoneyBillWave className="text-2xl text-green-600" />,
      description: "Thanh toán bằng tiền mặt khi nhận hàng tại địa chỉ của bạn."
    },
    { 
      id: "bank", 
      label: "Thanh toán qua ngân hàng", 
      icon: <FaCreditCard className="text-2xl text-blue-600" />,
      description: "Chuyển khoản qua tài khoản ngân hàng MBBank của chúng tôi."
    },
    { 
      id: "wallet", 
      label: "Thanh toán qua ví điện tử", 
      icon: <FaWallet className="text-2xl text-purple-600" />,
      description: "Thanh toán qua ví điện tử Momo nhanh chóng, tiện lợi."
    },
  ];

  // Hàm lấy tổng giá trị đơn hàng nếu có
  const getOrderAmount = useCallback(() => {
    if (!orderInfo || !orderInfo.product) return 100000; // Default amount
    
    try {
      let amount = 0;
      if (orderInfo.product.salePrice) {
        const salePrice = typeof orderInfo.product.salePrice === 'string' 
          ? parseInt(orderInfo.product.salePrice.replace(/[^\d]/g, '')) 
          : orderInfo.product.salePrice;
        amount = salePrice * (orderInfo.product.quantity || 1);
      }
      
      // Trừ giảm giá nếu có
      if (orderInfo.discount && orderInfo.discount.amount) {
        amount -= orderInfo.discount.amount;
      }
      
      return amount;
    } catch (error) {
      console.error('Error calculating order amount:', error);
      return 100000; // Default amount
    }
  }, [orderInfo]);

  // Fetch QR code based on payment method
  const fetchQrCode = useCallback(async () => {
    // Clear any existing errors
    setError(null);
    
    // Skip if payment method is COD
    if (paymentMethod === 'cod') {
      setQrData(null);
      return;
    }
    
    try {
      setLoading(true);
      
      // Determine the endpoint based on payment method
      const endpoint = paymentMethod === 'bank' ? '/mbqr' : '/momoqr';
      
      // Generate a reference ID for the payment
      const refId = `ORD${Date.now().toString().slice(-6)}`;
      
      // Get amount from order info if available
      const amount = getOrderAmount();
      
      console.log(`Fetching QR code from ${apiUrl}${endpoint} with amount ${amount}`);
      
      const response = await axios.get(`${apiUrl}${endpoint}`, {
        params: {
          amount: amount,
          order_id: refId
        }
      });
      
      setQrData(response.data);
      console.log('QR Data received:', response.data);
    } catch (error) {
      console.error('Error fetching QR code:', error);
      setError(error.message || 'Không thể tạo mã QR. Vui lòng thử lại sau.');
      
      // Try alternative URL if current one fails
      if (apiUrl === 'http://127.0.0.1:8000') {
        setApiUrl('http://localhost:8000');
      }
    } finally {
      setLoading(false);
    }
  }, [paymentMethod, apiUrl, getOrderAmount]);

  // Set up automatic refresh when payment method changes
  useEffect(() => {
    // Clear previous interval if exists
    if (refreshInterval) {
      clearInterval(refreshInterval);
      setRefreshInterval(null);
    }

    // Fetch QR code immediately when payment method changes
    if (paymentMethod === 'bank' || paymentMethod === 'wallet') {
      fetchQrCode();
      
      // Set up interval to refresh QR code every 30 seconds
      const interval = setInterval(() => {
        console.log('Refreshing QR code...');
        fetchQrCode();
      }, 30000); // 30 seconds
      
      setRefreshInterval(interval);
    }

    // Clean up interval on unmount
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [paymentMethod, fetchQrCode]);
  
  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [refreshInterval]);

  // Get payment method name
  const getPaymentName = () => {
    if (paymentMethod === 'bank') return 'MBBank';
    if (paymentMethod === 'wallet') return 'Momo';
    return '';
  };

  return (
    <section className="bg-white rounded-2xl shadow-lg p-6 mb-8 transition-all duration-300 hover:shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">Phương thức thanh toán</h2>

      <div className="flex flex-col gap-4">
        {methods.map((method) => (
          <div 
            key={method.id} 
            className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
              paymentMethod === method.id 
                ? "border-blue-500 bg-blue-50" 
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
            onClick={() => setPaymentMethod(method.id)}
          >
            <input
              type="radio"
              id={method.id}
              name="payment-method"
              checked={paymentMethod === method.id}
              onChange={() => setPaymentMethod(method.id)}
              className="hidden"
            />
            <label
              htmlFor={method.id}
              className="flex items-center gap-4 cursor-pointer w-full"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100">
                {method.icon}
              </div>
              <div className="flex-1">
                <p className="font-medium text-lg text-gray-800">{method.label}</p>
                <p className="text-sm text-gray-500">{method.description}</p>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === method.id 
                    ? "border-blue-500 bg-blue-500" 
                    : "border-gray-300"
                }`}
              >
                {paymentMethod === method.id && (
                  <span className="w-2 h-2 rounded-full bg-white"></span>
                )}
              </div>
            </label>
          </div>
        ))}
      </div>

      {/* QR Code Section - Displayed for both bank and wallet */}
      {(paymentMethod === "bank" || paymentMethod === "wallet") && (
        <div className="mt-6 border-t pt-4">
          <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <FaQrcode className="text-blue-600" />
            Mã QR thanh toán {getPaymentName()}
          </h3>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <FaSpinner className="animate-spin text-blue-500 text-3xl mb-2" />
              <p className="text-sm text-gray-500">Đang tạo mã QR...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-red-500">
              <FaExclamationCircle className="text-3xl mb-2" />
              <p className="text-sm text-center max-w-md">{error}</p>
              <button 
                onClick={fetchQrCode}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Thử lại
              </button>
            </div>
          ) : qrData ? (
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-1">
                <div className="bg-gray-50 p-4 rounded-xl flex justify-center">
                  <img 
                    src={`data:image/png;base64,${qrData.qr_image_base64}`}
                    alt="QR thanh toán" 
                    className="max-w-[250px]"
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium">Số tiền:</span>
                    <span className="text-blue-600 font-bold">{formatPrice(qrData.amount)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium">Nội dung:</span>
                    <span>{qrData.note}</span>
                  </div>
                  
                  <p className="text-xs text-gray-500 bg-yellow-50 p-2 rounded-lg border border-yellow-200">
                    Mã QR sẽ tự động làm mới sau 30 giây để đảm bảo tính bảo mật
                  </p>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        // Download QR code as image
                        const link = document.createElement('a');
                        link.href = `data:image/png;base64,${qrData.qr_image_base64}`;
                        link.download = `payment-qr-${qrData.note}.png`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg transition-colors"
                    >
                      <FaDownload /> Tải mã QR
                    </button>
                    
                    {paymentMethod === 'wallet' && qrData.momo_uri && (
                      <a 
                        href={qrData.momo_uri}
                        className="flex-1 flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded-lg transition-colors"
                      >
                        <FaWallet /> Mở Momo
                      </a>
                    )}
                    
                    {paymentMethod === 'bank' && qrData.mb_link && (
                      <a 
                        href={qrData.mb_link}
                        target="_blank"
                        rel="noopener noreferrer" 
                        className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg transition-colors"
                      >
                        <FaCreditCard /> Mở MBBank
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center py-8">
              <button 
                onClick={fetchQrCode}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Tạo mã QR thanh toán
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default PaymentMethods;
