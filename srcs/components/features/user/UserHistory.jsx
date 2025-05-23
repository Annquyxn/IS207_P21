import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/components/services/supabase";
import Spinner from "@/components/ui/Spinner";
import { formatCurrency } from "@/utils/format";
import { useState } from "react";
import { motion } from "framer-motion";
import { FaHistory, FaShoppingBag, FaBoxOpen, FaCheckCircle, FaMapMarkerAlt, FaTruck, FaCalendarAlt, FaReceipt, FaInfoCircle, FaTimes, FaExchangeAlt } from "react-icons/fa";
import { useUser } from "./UserContext";

const HISTORY_STATUS_FILTERS = {
  all: "Tất cả",
  completed: "Đã hoàn thành",
  cancelled: "Đã hủy",
  refunded: "Đã hoàn tiền"
};

const DELIVERY_STATUS = {
  pending: "Đang chuẩn bị",
  shipping: "Đang vận chuyển",
  delivered: "Đã giao hàng thành công",
  returned: "Đã hoàn trả",
  cancelled: "Đã hủy"
};

const STATUS_COLORS = {
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-gray-200 text-gray-600",
  refunded: "bg-red-100 text-red-800",
  pending: "bg-yellow-100 text-yellow-800",
  shipping: "bg-blue-100 text-blue-800",
  delivered: "bg-green-100 text-green-800",
  returned: "bg-amber-100 text-amber-800"
};

const STATUS_ICONS = {
  completed: <FaCheckCircle className="mr-2" />,
  cancelled: <FaTimes className="mr-2" />,
  refunded: <FaExchangeAlt className="mr-2" />,
  pending: <FaShoppingBag className="mr-2" />,
  shipping: <FaTruck className="mr-2" />,
  delivered: <FaCheckCircle className="mr-2" />,
  returned: <FaExchangeAlt className="mr-2" />
};

function UserHistory() {
  const { getUserId } = useUser();
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  
  const { data: orders, isLoading } = useQuery({
    queryKey: ["user-history"],
    queryFn: async () => {
      const userId = await getUserId();
      if (!userId) {
        console.error("User not logged in");
        return [];
      }
      
      const { data, error } = await supabase
        .from("orders")
        .select("*, items:order_items(*)")
        .eq("user_id", userId)
        .in("status", ["completed", "cancelled", "refunded"])
        .order("updated_at", { ascending: false });
        
      if (error) throw error;
      return data;
    },
  });

  // Filter orders based on selected status
  const filteredOrders = statusFilter === "all"
    ? orders
    : orders?.filter(order => order.status === statusFilter);

  // Handle order selection for details view
  const handleViewOrderDetails = (orderId) => {
    setSelectedOrderId(orderId === selectedOrderId ? null : orderId);
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 px-8 py-6 text-white">
        <h2 className="text-2xl font-bold flex items-center">
          <FaHistory className="mr-3" /> Lịch sử mua hàng
        </h2>
        <p className="text-red-100 mt-1">Các đơn hàng đã hoàn thành, hủy hoặc hoàn tiền</p>
      </div>
      
      <div className="p-8">
        {/* Filter tabs */}
        <div className="flex flex-wrap gap-3 mb-6">
          {Object.entries(HISTORY_STATUS_FILTERS).map(([key, label]) => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-5 py-2.5 rounded-full border-2 text-sm font-medium transition-all duration-200 ${
                statusFilter === key
                  ? "bg-red-600 text-white border-red-600 shadow-md"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
              }`}
              onClick={() => setStatusFilter(key)}
            >
              {label}
            </motion.button>
          ))}
        </div>
        
        {filteredOrders?.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-20 h-20 mx-auto mb-4 bg-red-50 rounded-full flex items-center justify-center text-red-400 text-3xl">
              <FaBoxOpen />
            </div>
            <h3 className="text-gray-500 text-lg font-medium">Bạn chưa có đơn hàng nào trong mục này</h3>
            <p className="text-gray-400 mt-2">Đơn hàng khi hoàn thành hoặc hủy sẽ được hiển thị ở đây</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders?.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.3 }}
                className={`border ${order.status === 'completed' ? 'border-green-200' : 
                             order.status === 'cancelled' ? 'border-gray-200' : 
                             'border-red-200'} rounded-xl p-5 hover:shadow-md transition-all duration-300`}
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div>
                    <div className="flex items-center mb-2">
                      <span className="text-gray-400 text-sm mr-2">Mã đơn hàng:</span>
                      <span className="font-semibold text-gray-700">#{order.id}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <FaCalendarAlt className="mr-2 text-gray-400" />
                      <span>
                        Ngày mua: {new Date(order.created_at).toLocaleDateString("vi-VN", {
                          year: 'numeric',
                          month: 'numeric',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    {order.updated_at && (
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <FaHistory className="mr-2 text-gray-400" />
                        <span>
                          Cập nhật: {new Date(order.updated_at).toLocaleDateString("vi-VN", {
                            year: 'numeric',
                            month: 'numeric',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="md:text-right">
                    <span
                      className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-sm font-medium ${
                        STATUS_COLORS[order.status] || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {STATUS_ICONS[order.status] || <FaInfoCircle className="mr-2" />}
                      {HISTORY_STATUS_FILTERS[order.status] || order.status}
                    </span>
                    
                    {/* Delivery status if available */}
                    {order.delivery_status && (
                      <span
                        className={`block mt-2 inline-flex items-center px-3.5 py-1.5 rounded-full text-sm font-medium ${
                          STATUS_COLORS[order.delivery_status] || "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {STATUS_ICONS[order.delivery_status] || <FaTruck className="mr-2" />}
                        {DELIVERY_STATUS[order.delivery_status] || order.delivery_status}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Product preview */}
                {order.items?.length > 0 && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      <FaShoppingBag className="inline-block mr-2 text-red-500" />
                      Sản phẩm đã mua
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {order.items.slice(0, 3).map((item, i) => (
                        <div key={i} className="flex items-center bg-white p-2 rounded-lg border border-gray-200">
                          <div className="w-10 h-10 bg-white border border-gray-100 rounded flex items-center justify-center mr-3">
                            {item.image ? (
                              <img src={item.image} alt={item.product_name} className="w-8 h-8 object-contain" />
                            ) : (
                              <FaShoppingBag className="text-gray-300" />
                            )}
                          </div>
                          <div className="flex-1 truncate">
                            <p className="text-xs font-medium text-gray-800 truncate">
                              {item.product_name || `Sản phẩm ${i + 1}`}
                            </p>
                            <p className="text-xs text-gray-500">
                              SL: {item.quantity} × {formatCurrency(item.price || 0)}
                            </p>
                          </div>
                        </div>
                      ))}
                      
                      {order.items.length > 3 && (
                        <div className="flex items-center justify-center bg-gray-50 p-2 rounded-lg border border-dashed border-gray-200">
                          <span className="text-xs text-gray-500">
                            +{order.items.length - 3} sản phẩm khác
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Order details (when expanded) */}
                {selectedOrderId === order.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 bg-gray-50 rounded-lg p-4 overflow-hidden"
                  >
                    {/* Shipping info if available */}
                    {order.shipping_address && (
                      <div className="mb-4 pb-3 border-b border-gray-200">
                        <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                          <FaMapMarkerAlt className="mr-2 text-red-500" />
                          Thông tin giao hàng
                        </h4>
                        <div className="text-sm text-gray-600 ml-1">
                          <p className="font-medium">{order.shipping_address.recipient}</p>
                          <p>{order.shipping_address.phone}</p>
                          <p>{order.shipping_address.address}</p>
                          <p>{order.shipping_address.ward}, {order.shipping_address.district}, {order.shipping_address.city}</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Payment info if available */}
                    {order.payment_method && (
                      <div className="mb-4 pb-3 border-b border-gray-200">
                        <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                          <FaReceipt className="mr-2 text-green-500" />
                          Thông tin thanh toán
                        </h4>
                        <div className="ml-1">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Phương thức:</span> {order.payment_method}
                          </p>
                          {order.payment_status && (
                            <p className="text-sm text-gray-600 mt-1">
                              <span className="font-medium">Trạng thái:</span>{" "}
                              <span className={order.payment_status === 'paid' ? 'text-green-600' : 'text-amber-600'}>
                                {order.payment_status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                              </span>
                            </p>
                          )}
                          {order.transaction_id && (
                            <p className="text-sm text-gray-600 mt-1">
                              <span className="font-medium">Mã giao dịch:</span> {order.transaction_id}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Order summary */}
                    <div className="mt-3">
                      <h4 className="font-medium text-gray-700 mb-2">Chi tiết hóa đơn</h4>
                      <div className="text-sm space-y-1 ml-1">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tạm tính:</span>
                          <span className="text-gray-800">{formatCurrency(order.subtotal || order.total_amount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Phí vận chuyển:</span>
                          <span className="text-gray-800">{formatCurrency(order.shipping_fee || 0)}</span>
                        </div>
                        {order.discount > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Giảm giá:</span>
                            <span className="text-green-600">-{formatCurrency(order.discount)}</span>
                          </div>
                        )}
                        <div className="flex justify-between pt-2 mt-2 border-t border-gray-200 font-medium">
                          <span className="text-gray-700">Tổng cộng:</span>
                          <span className="text-red-600">{formatCurrency(order.total_amount)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Status history */}
                    {order.status_history && order.status_history.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <h4 className="font-medium text-gray-700 mb-2">Lịch sử trạng thái</h4>
                        <div className="ml-1 space-y-3">
                          {order.status_history.map((statusItem, index) => (
                            <div key={index} className="flex gap-3">
                              <div className="relative">
                                <div className="w-3 h-3 rounded-full bg-red-500 mt-1"></div>
                                {index < order.status_history.length - 1 && (
                                  <div className="absolute top-4 bottom-0 left-1.5 w-0.5 -ml-px h-full bg-gray-200"></div>
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-800">
                                  {HISTORY_STATUS_FILTERS[statusItem.status] || 
                                   DELIVERY_STATUS[statusItem.status] || 
                                   statusItem.status}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {new Date(statusItem.timestamp).toLocaleString("vi-VN")}
                                </p>
                                {statusItem.note && (
                                  <p className="text-xs text-gray-600 mt-1 italic">{statusItem.note}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
                
                <div className="h-px bg-gray-100 my-4"></div>
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div className="text-sm text-gray-700 mb-2 sm:mb-0">
                    <span className="bg-red-50 text-red-700 px-2.5 py-1 rounded-lg font-medium">
                      {order.items?.length || 0} sản phẩm
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-500 block sm:inline">Tổng tiền:</span>
                    <span className="text-xl font-bold text-red-600 ml-2">
                      {formatCurrency(order.total_amount)}
                    </span>
                  </div>
                </div>
                
                <div className="mt-5 flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                    whileTap={{ scale: 0.95 }}
                    className={`${
                      selectedOrderId === order.id
                        ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow hover:shadow-lg"
                    } px-6 py-2.5 rounded-lg text-sm font-medium transition-all`}
                    onClick={() => handleViewOrderDetails(order.id)}
                  >
                    {selectedOrderId === order.id ? "Ẩn chi tiết" : "Xem chi tiết"}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserHistory;
