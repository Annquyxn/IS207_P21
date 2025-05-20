import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import OrderSummary from '../features/orders/OrderSummary';
import SubmitOrderButton from '../features/orders/SubmitOrderButton';
import AddressForm from '../features/auth/AddressForm';
import PaymentMethods from '../features/payment/PaymentMethods';
import { FiUser, FiCreditCard, FiCheck, FiTag, FiShoppingBag, FiPackage, FiMapPin, FiPhone, FiHome } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { insertOrder } from '../features/orders/apiOrders';

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
  const [showProgress, setShowProgress] = useState(false);

  // Show progress bar after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowProgress(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

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
    if (!price && price !== 0) return "0 ₫";
    
    // If price is already a string in the right format, return it
    if (typeof price === 'string' && price.includes('₫')) {
      return price;
    }
    
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

  // Calculate final price
  const calculateFinalPrice = () => {
    try {
      const originalPrice = product?.salePrice ? 
        (typeof product.salePrice === 'string' && product.salePrice.replace ? 
          parseInt(product.salePrice.replace(/[^\d]/g, '')) : 
          parseInt(product.salePrice) || 0) : 0;
      
      const discountAmount = appliedDiscount ? appliedDiscount.amount : 0;
      return originalPrice - discountAmount;
    } catch (error) {
      console.error('Error calculating final price:', error);
      return 0;
    }
  };

  const stepIcons = {
    1: <FiMapPin className="w-6 h-6" />,
    2: <FiCreditCard className="w-6 h-6" />,
    3: <FiCheck className="w-6 h-6" />
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center p-10 bg-white rounded-2xl shadow-xl max-w-md w-full"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
              <FiPackage className="w-8 h-8 text-red-500" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Không tìm thấy thông tin đơn hàng</h2>
          <p className="text-gray-600 mb-6">Đơn hàng có thể đã hết hạn hoặc không tồn tại</p>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            Quay lại trang chủ
          </button>
        </motion.div>
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
  const handleOrderComplete = async () => {
    try {
      // Hiển thị thông báo đang xử lý
      toast.loading('Đang xử lý đơn hàng...');

      // Tạo đơn hàng trong Supabase
      await insertOrder({
        addressData,
        paymentMethod,
        product,
        discount: appliedDiscount
      });

      // Đóng thông báo loading và hiển thị thông báo thành công
      toast.dismiss();
      toast.success('Đặt hàng thành công!');

      // Chuyển đến trang hoàn tất đơn hàng
      navigate('/complete', {
        state: {
          orderInfo: {
            product,
            addressData,
            paymentMethod,
            discount: appliedDiscount
          }
        }
      });
    } catch (error) {
      // Đóng thông báo loading và hiển thị thông báo lỗi
      toast.dismiss();
      toast.error(`Đặt hàng thất bại: ${error.message || 'Đã có lỗi xảy ra'}`);
      console.error('Lỗi khi đặt hàng:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Thông tin đặt hàng</h1>
          <p className="text-gray-600">Hoàn tất thông tin để tiến hành thanh toán</p>
        </motion.div>

        {/* Stepper */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center justify-center">
            <div className="relative flex items-center md:w-[600px] w-full justify-between px-4">
              {[1, 2, 3].map((step) => (
                <motion.div 
                  key={step}
                  initial={{ scale: 0.8 }}
                  animate={{ 
                    scale: currentStep >= step ? 1.1 : 1,
                    transition: { delay: step * 0.1 }
                  }} 
                  className="relative flex flex-col items-center"
                >
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 ${
                      currentStep >= step 
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' 
                        : 'bg-gray-100 text-gray-400 border border-gray-200'
                    } z-10`}
                  >
                    {stepIcons[step]}
                  </motion.div>
                  <span className={`absolute top-16 w-max text-sm font-medium transition-colors duration-300 ${
                    currentStep >= step ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {step === 1 ? 'Thông tin giao hàng' : step === 2 ? 'Thanh toán' : 'Xác nhận'}
                  </span>
                </motion.div>
              ))}
              {/* Đường nối giữa các bước */}
              <div className="absolute top-7 left-0 w-full h-[3px] bg-gray-100 rounded-full">
                {showProgress && (
                  <motion.div 
                    initial={{ width: '0%' }}
                    animate={{ 
                      width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%'
                    }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                  />
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {currentStep === 1 && (
              <motion.div 
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                className="bg-white p-8 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <FiHome className="text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Thông tin giao hàng</h2>
                </div>
                <AddressForm onSubmitSuccess={handleAddressSubmit} />
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div 
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                className="bg-white p-8 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <FiCreditCard className="text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Phương thức thanh toán</h2>
                </div>
                <PaymentMethods 
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                  orderInfo={{
                    product: product,
                    discount: appliedDiscount
                  }}
                />
                <div className="mt-8">
                  <button
                    onClick={handlePaymentSubmit}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-4 rounded-xl font-semibold transition-all duration-300 hover:from-blue-600 hover:to-blue-800 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Tiếp tục
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div 
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                className="bg-white p-8 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <FiCheck className="text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Xác nhận đơn hàng</h2>
                </div>
                <div className="space-y-6">
                  {/* Hiển thị thông tin địa chỉ */}
                  <div className="border-b pb-4">
                    <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                      <FiMapPin className="text-blue-500" /> Địa chỉ giao hàng:
                    </h3>
                    <div className="pl-6 space-y-1">
                      <div className="flex items-center gap-2">
                        <FiUser className="text-gray-400" />
                        <p className="text-gray-800">{addressData?.fullName}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiPhone className="text-gray-400" />
                        <p className="text-gray-800">{addressData?.phone}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiHome className="text-gray-400" />
                        <p className="text-gray-800">
                          {addressData?.fullAddress || 
                           `${addressData?.street || ''}, ${addressData?.wardName || addressData?.ward || ''}, ${addressData?.districtName || addressData?.district || ''}, ${addressData?.cityName || addressData?.city || ''}`}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Hiển thị phương thức thanh toán */}
                  <div className="border-b pb-4">
                    <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                      <FiCreditCard className="text-purple-500" /> Phương thức thanh toán:
                    </h3>
                    <div className="pl-6 py-2 bg-gray-50 rounded-lg">
                      <p className="font-medium">
                        {paymentMethod === 'cod' 
                          ? '💰 Thanh toán khi nhận hàng' 
                          : paymentMethod === 'bank' 
                            ? '🏦 Thanh toán qua ngân hàng' 
                            : '💳 Thanh toán qua ví điện tử'}
                      </p>
                    </div>
                  </div>
                  
                  <motion.button
                    onClick={handleOrderComplete}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl font-semibold transition-all duration-300 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl"
                  >
                    Xác nhận đặt hàng
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="space-y-6"
          >
            {/* Product Summary */}
            <div className="bg-white p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl">
              <h2 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2 flex items-center gap-2">
                <FiShoppingBag className="text-blue-500" /> Thông tin sản phẩm
              </h2>
              
              <div className="flex gap-4 items-start">
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200 shadow-sm">
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
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm font-bold text-red-600">
                      {product?.salePrice ? formatPrice(product.salePrice) : formatPrice(0)}
                    </span>
                    {product?.originalPrice && (
                      <span className="text-xs text-gray-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                    {/* Hiển thị % giảm giá */}
                    {(() => {
                      try {
                        if (!product?.originalPrice || !product?.salePrice) return null;
                        
                        const original = typeof product.originalPrice === 'string' && product.originalPrice.replace ?
                          parseInt(product.originalPrice.replace(/[^\d]/g, '')) : 
                          typeof product.originalPrice === 'number' ? product.originalPrice : 0;
                          
                        const sale = typeof product.salePrice === 'string' && product.salePrice.replace ?
                          parseInt(product.salePrice.replace(/[^\d]/g, '')) : 
                          typeof product.salePrice === 'number' ? product.salePrice : 0;
                          
                        if (original > sale) {
                          const discountPercent = Math.round(((original - sale) / original) * 100);
                          return (
                            <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-medium">
                              -{discountPercent}%
                            </span>
                          );
                        }
                        return null;
                      } catch (error) {
                        console.error('Error calculating discount percentage:', error);
                        return null;
                      }
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
              <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <FiTag className="text-purple-500" /> Mã giảm giá
              </h2>
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
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  />
                </div>
                <button
                  onClick={handleApplyDiscount}
                  disabled={!discountCode || isApplyingDiscount}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    !discountCode || isApplyingDiscount
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:shadow-md active:scale-95'
                  }`}
                >
                  {isApplyingDiscount ? 'Đang áp dụng...' : 'Áp dụng'}
                </button>
              </div>
              
              {appliedDiscount && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200"
                >
                  <div className="flex items-center justify-between text-green-700">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                        <FiCheck className="text-green-600" />
                      </div>
                      <span className="font-medium">Mã {appliedDiscount.code}</span>
                    </div>
                    <span className="text-sm font-bold">-{appliedDiscount.percent}%</span>
                  </div>
                  <div className="mt-2 text-sm text-green-600 pl-8">
                    Giảm {formatPrice(appliedDiscount.amount)}
                    {appliedDiscount.amount === appliedDiscount.maxAmount && 
                      ` (Tối đa ${formatPrice(appliedDiscount.maxAmount)})`}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Order Summary Component */}
            <OrderSummary 
              subtotal={product?.salePrice ? 
                (typeof product.salePrice === 'string' && product.salePrice.replace ? 
                  parseInt(product.salePrice.replace(/[^\d]/g, '')) : 
                  parseInt(product.salePrice) || 0) : 0}
              shipping={0}
              discount={appliedDiscount?.amount || 0}
              total={calculateFinalPrice()}
              formatPrice={formatPrice}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;