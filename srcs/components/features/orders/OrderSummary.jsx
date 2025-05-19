import { FaTicketAlt as TicketIcon } from "react-icons/fa";
import { FiTag } from "react-icons/fi";

function OrderSummary({ subtotal, shipping = 0, discount = 0, total }) {
  // Format giá theo định dạng VND
  const formatPrice = (price) => {
    if (!price && price !== 0) return "0₫";
    try {
      return price.toLocaleString('vi-VN') + '₫';
    } catch (error) {
      return price + '₫';
    }
  };

  // Tính % giảm giá
  const calculateDiscountPercentage = () => {
    if (!subtotal || subtotal === 0 || !discount || discount === 0) return 0;
    return Math.round((discount / subtotal) * 100);
  };

  const discountPercentage = calculateDiscountPercentage();

  return (
    <div className="flex flex-col gap-4 w-full bg-white rounded-xl shadow-md p-6">
      <h3 className="text-base font-semibold text-gray-800 border-b pb-2">Chi tiết đơn hàng</h3>
      
      {/* Tạm tính */}
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600">Tạm tính</span>
        <span className="font-medium">{formatPrice(subtotal)}</span>
      </div>

      {/* Phí vận chuyển */}
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600">Phí vận chuyển</span>
        <span className="font-medium">{formatPrice(shipping)}</span>
      </div>

      {/* Giảm giá */}
      {discount > 0 && (
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-1 text-green-600">
            <FiTag className="w-3.5 h-3.5" />
            <span>Giảm giá {discountPercentage > 0 ? `(${discountPercentage}%)` : ''}</span>
          </div>
          <span className="font-medium text-green-600">-{formatPrice(discount)}</span>
        </div>
      )}

      {/* Đường kẻ */}
      <div className="border-t border-gray-200 my-1"></div>

      {/* Tổng tiền */}
      <div className="flex justify-between items-center">
        <span className="text-base font-semibold">Tổng cộng</span>
        <span className="text-lg font-bold text-red-600">{formatPrice(total)}</span>
      </div>

      {/* VAT */}
      <p className="text-xs text-gray-500 text-right">
        (Đã bao gồm VAT nếu có)
      </p>
    </div>
  );
}

export default OrderSummary;
