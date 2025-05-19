import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import OrderSummary from '../features/orders/OrderSummary';
import SubmitOrderButton from '../features/orders/SubmitOrderButton';
import AddressForm from '../features/auth/AddressForm';
import PaymentMethods from '../features/payment/PaymentMethods';
import { FiUser, FiCreditCard, FiCheck, FiTag } from 'react-icons/fi';

const OrderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product } = location.state || {};
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [addressData, setAddressData] = useState(null);
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);

  // Giả lập danh sách mã giảm giá
  const availableDiscounts = {
    'WELCOME': { percent: 10, maxAmount: 100000 },
    'SUMMER': { percent: 15, maxAmount: 150000 },
    'SPECIAL': { percent: 20, maxAmount: 200000 }
  };

  const handleApplyDiscount = () => {
    setIsApplyingDiscount(true);
    // Giả lập API call
    setTimeout(() => {
      const discount = availableDiscounts[discountCode.toUpperCase()];
      if (discount) {
        const originalPrice = parseInt(product.salePrice.replace(/[^\d]/g, ''));
        const discountAmount = Math.min(
          (originalPrice * discount.percent) / 100,
          discount.maxAmount
        );
        setAppliedDiscount({
          code: discountCode.toUpperCase(),
          percent: discount.percent,
          amount: discountAmount,
          maxAmount: discount.maxAmount
        });
      } else {
        setAppliedDiscount(null);
      }
      setIsApplyingDiscount(false);
    }, 500);
  };

  // Format price to VND
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Calculate final price
  const calculateFinalPrice = () => {
    const originalPrice = parseInt(product.salePrice.replace(/[^\d]/g, ''));
    const discountAmount = appliedDiscount ? appliedDiscount.amount : 0;
    return originalPrice - discountAmount;
  };

  const stepIcons = {
    1: <FiUser className="w-6 h-6" />,
    2: <FiCreditCard className="w-6 h-6" />,
    3: <FiCheck className="w-6 h-6" />
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg transform transition-all hover:scale-105">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Không tìm thấy thông tin đơn hàng</h2>
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-300 hover:underline"
          >
            Quay lại trang chủ
          </button>
        </div>
      </div>
    );
  }

  // Xử lý khi form địa chỉ được submit
  const handleAddressSubmit = (data) => {
    setAddressData(data);
    setCurrentStep(2); // Tự động chuyển sang bước thanh toán
  };

  // Xử lý khi chọn phương thức thanh toán
  const handlePaymentSubmit = () => {
    setCurrentStep(3);
  };

  // Xử lý khi hoàn tất đơn hàng
  const handleOrderComplete = () => {
    navigate('/complete', {
      state: {
        orderInfo: {
          product,
          addressData,
          paymentMethod
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Stepper */}
        <div className="mb-12">
          <div className="flex items-center justify-center">
            <div className="relative flex items-center w-[600px] justify-between">
              {[1, 2, 3].map((step) => (
                <div key={step} className="relative flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 transform ${
                    currentStep >= step 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  } z-10 ${currentStep >= step ? 'scale-110' : ''}`}>
                    {stepIcons[step]}
                  </div>
                  <span className={`absolute top-16 w-max text-sm font-medium transition-colors duration-300 ${
                    currentStep >= step ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {step === 1 ? 'Thông tin giao hàng' : step === 2 ? 'Thanh toán' : 'Hoàn tất'}
                  </span>
                </div>
              ))}
              {/* Đường nối giữa các bước */}
              <div className="absolute top-6 left-0 w-full h-[2px] bg-gray-200">
                <div className={`h-full bg-blue-600 transition-all duration-300 ${
                  currentStep === 1 ? 'w-0' : currentStep === 2 ? 'w-1/2' : 'w-full'
                }`} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {currentStep === 1 && (
              <div className="bg-white p-8 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Thông tin giao hàng</h2>
                <AddressForm onSubmitSuccess={handleAddressSubmit} />
              </div>
            )}

            {currentStep === 2 && (
              <div className="bg-white p-8 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Phương thức thanh toán</h2>
                <PaymentMethods 
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                />
                <div className="mt-8">
                  <button
                    onClick={handlePaymentSubmit}
                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold transition-all duration-300 hover:bg-blue-700 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Tiếp tục
                  </button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="bg-white p-8 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Xác nhận đơn hàng</h2>
                <div className="space-y-6">
                  {/* Hiển thị thông tin địa chỉ */}
                  <div className="border-b pb-4">
                    <h3 className="font-medium text-gray-700 mb-2">Địa chỉ giao hàng:</h3>
                    <p>{addressData?.fullName}</p>
                    <p>{addressData?.phone}</p>
                    <p>{addressData?.address}</p>
                  </div>
                  {/* Hiển thị phương thức thanh toán */}
                  <div className="border-b pb-4">
                    <h3 className="font-medium text-gray-700 mb-2">Phương thức thanh toán:</h3>
                    <p>{paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 
                       paymentMethod === 'bank' ? 'Thanh toán qua ngân hàng' : 
                       'Thanh toán qua ví điện tử'}</p>
                  </div>
                  <button
                    onClick={handleOrderComplete}
                    className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold transition-all duration-300 hover:bg-green-700 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Xác nhận đặt hàng
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            {/* Product Summary */}
            <div className="bg-white p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl">
              <h2 className="text-base font-semibold mb-4 text-gray-800 border-b pb-2">Thông tin sản phẩm</h2>
              
              <div className="flex gap-3 items-start">
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-800 line-clamp-2">
                    {product.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-semibold text-red-600">
                      {formatPrice(parseInt(product.salePrice.replace(/[^\d]/g, '')))}
                    </span>
                    <span className="text-xs text-gray-500 line-through">
                      {formatPrice(parseInt(product.originalPrice.replace(/[^\d]/g, '')))}
                    </span>
                    {/* Hiển thị % giảm giá */}
                    {(() => {
                      const original = parseInt(product.originalPrice.replace(/[^\d]/g, '')) || 0;
                      const sale = parseInt(product.salePrice.replace(/[^\d]/g, '')) || 0;
                      if (original > sale) {
                        const discountPercent = Math.round(((original - sale) / original) * 100);
                        return (
                          <span className="bg-red-100 text-red-600 text-xs px-1.5 py-0.5 rounded">
                            -{discountPercent}%
                          </span>
                        );
                      }
                      return null;
                    })()}
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                    <span>Số lượng: {product.quantity || 1}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Discount Code Section */}
            <div className="bg-white p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Mã giảm giá</h2>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <FiTag className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                    placeholder="Nhập mã giảm giá"
                    className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  />
                </div>
                <button
                  onClick={handleApplyDiscount}
                  disabled={!discountCode || isApplyingDiscount}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    !discountCode || isApplyingDiscount
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg active:scale-95'
                  }`}
                >
                  {isApplyingDiscount ? 'Đang áp dụng...' : 'Áp dụng'}
                </button>
              </div>
              
              {appliedDiscount && (
                <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="flex items-center justify-between text-green-700">
                    <span className="font-medium">Mã {appliedDiscount.code}</span>
                    <span className="text-sm">-{appliedDiscount.percent}%</span>
                  </div>
                  <div className="mt-1 text-sm text-green-600">
                    Giảm {formatPrice(appliedDiscount.amount)}
                    {appliedDiscount.amount === appliedDiscount.maxAmount && 
                      ` (Tối đa ${formatPrice(appliedDiscount.maxAmount)})`}
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Component */}
            <OrderSummary 
              subtotal={parseInt(product.salePrice.replace(/[^\d]/g, ''))}
              shipping={0}
              discount={appliedDiscount?.amount || 0}
              total={calculateFinalPrice()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;