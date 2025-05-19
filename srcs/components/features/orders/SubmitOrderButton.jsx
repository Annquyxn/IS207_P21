import { useState } from 'react';
import { FiCheck, FiLoader } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { insertOrder } from './apiOrders';

/**
 * Component nút đặt hàng với xử lý gửi đơn hàng đến Supabase
 * 
 * @param {Object} props - Component props
 * @param {Object} props.addressData - Dữ liệu địa chỉ
 * @param {Object} props.product - Thông tin sản phẩm
 * @param {string} props.paymentMethod - Phương thức thanh toán
 * @param {Object|null} props.discount - Thông tin giảm giá
 * @param {Function} props.onSuccess - Callback khi đặt hàng thành công
 * @param {Function} props.onError - Callback khi đặt hàng thất bại
 */
function SubmitOrderButton({
  addressData,
  product,
  paymentMethod,
  discount,
  onSuccess,
  onError
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const handleSubmit = async () => {
    if (!addressData || !product || !paymentMethod) {
      onError?.('Thông tin đơn hàng không đầy đủ');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Gọi API để lưu đơn hàng vào Supabase
      const data = await insertOrder({
        addressData,
        paymentMethod,
        product,
        discount
      });
      
      // Đặt đơn hàng thành công
      setIsSuccess(true);
      
      // Gọi callback thành công nếu có
      if (onSuccess) {
        setTimeout(() => {
          onSuccess(data);
        }, 1000); // Cho người dùng thấy trạng thái thành công trong 1 giây
      }
    } catch (error) {
      console.error('Lỗi khi đặt đơn hàng:', error);
      // Gọi callback lỗi nếu có
      onError?.(error.message || 'Đã xảy ra lỗi khi đặt hàng');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <motion.button
      onClick={handleSubmit}
      disabled={isSubmitting}
      whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
      whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
      className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all ${
        isSuccess
          ? 'bg-green-600 text-white'
          : isSubmitting
            ? 'bg-gray-400 text-white cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-md hover:shadow-lg'
      }`}
    >
      {isSubmitting ? (
        <>
          <FiLoader className="w-5 h-5 animate-spin" />
          <span>Đang xử lý...</span>
        </>
      ) : isSuccess ? (
        <>
          <FiCheck className="w-5 h-5" />
          <span>Đặt hàng thành công!</span>
        </>
      ) : (
        <span>Đặt hàng ngay</span>
      )}
    </motion.button>
  );
}

export default SubmitOrderButton;
