import { FaTicketAlt as TicketIcon } from "react-icons/fa";

function OrderSummary() {
  return (
    <div className="flex flex-col gap-6 mt-10 w-full max-w-md mx-auto px-6">
      {/* Voucher */}
      <div className="flex items-center gap-3 px-4 py-3 bg-pink-100 border-2 border-pink-600 text-pink-600 rounded-lg shadow-md">
        <TicketIcon className="w-5 h-5" />
        <span className="text-lg font-semibold">Voucher giảm giá</span>
      </div>

      {/* Phí vận chuyển */}
      <div className="flex justify-between w-full items-center mt-4">
        <span className="text-xl font-extrabold text-gray-700">
          Phí vận chuyển
        </span>
        <span className="text-xl font-semibold text-right text-gray-800">
          0<span className="underline">đ</span>
        </span>
      </div>

      {/* Tổng tiền */}
      <div className="flex justify-between w-full items-center mt-4">
        <span className="text-2xl font-extrabold text-red-600">Tổng tiền</span>
        <span className="text-3xl font-bold text-red-600">
          12.000.000<span className="underline">đ</span>
        </span>
      </div>
    </div>
  );
}

export default OrderSummary;
