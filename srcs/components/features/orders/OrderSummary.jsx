function OrderSummary() {
  return (
    <div className="flex flex-col gap-4 mt-10 w-full items-start">
      {/* Voucher */}
      <div className="flex items-center gap-3 px-3 py-2 bg-pink-200 border border-red-600 text-red-600 max-w-[280px] w-full">
        <TicketIcon className="w-4 h-4" />
        <span>Voucher giảm giá</span>
      </div>

      {/* Phí vận chuyển */}
      <div className="flex justify-between w-full items-center">
        <span className="text-2xl font-extrabold">Phí vận chuyển</span>
        <span className="text-2xl font-bold text-right">
          0<span className="underline">đ</span>
        </span>
      </div>

      {/* Tổng tiền */}
      <div className="flex justify-between w-full items-center">
        <span className="text-2xl font-extrabold text-red-600">Tổng tiền</span>
        <span className="text-3xl font-bold text-red-600">
          12.000.000<span className="underline">đ</span>
        </span>
      </div>
    </div>
  );
}

export default OrderSummary;
