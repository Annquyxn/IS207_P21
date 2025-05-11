export default function OrderSummary() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Tóm tắt đơn hàng</h2>
      
      <div className="space-y-4">
        <div className="flex justify-between">
          <span>Tạm tính:</span>
          <span>0đ</span>
        </div>
        
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Mã giảm giá"
            className="flex-grow px-4 py-2 border rounded-lg"
          />
          <button className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
            Áp dụng
          </button>
        </div>
        
        <div className="flex justify-between font-bold border-t pt-4">
          <span>Tổng tiền:</span>
          <span className="text-red-600">0đ</span>
        </div>
        
        <button 
          className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400"
          disabled
        >
          Tiến hành đặt hàng
        </button>
      </div>
    </div>
  )
}