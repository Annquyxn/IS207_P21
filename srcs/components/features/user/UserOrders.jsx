import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/components/services/supabase";
import Spinner from "@/components/ui/Spinner";
import { formatCurrency } from "@/utils/format";
import { useState } from "react";
import { motion } from "framer-motion";
import { FaShoppingBag, FaBoxOpen, FaShippingFast, FaCheck, FaTimes, FaMoneyBill, FaHistory, FaInfoCircle } from "react-icons/fa";
import { useUser } from "./UserContext";
import { toast } from "react-hot-toast";

const STATUS_LABELS = {
  all: "Tất cả",
  pending: "Chờ xác nhận",
  processing: "Đang xử lý",
  shipping: "Đang giao hàng",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
  refunded: "Đã hoàn tiền"
};

const STATUS_ICONS = {
  pending: <FaShoppingBag className="mr-2" />,
  processing: <FaMoneyBill className="mr-2" />,
  shipping: <FaShippingFast className="mr-2" />,
  completed: <FaCheck className="mr-2" />,
  cancelled: <FaTimes className="mr-2" />,
  refunded: <FaHistory className="mr-2" />
};

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipping: "bg-indigo-100 text-indigo-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-gray-200 text-gray-600",
  refunded: "bg-red-100 text-red-800"
};

function UserOrders() {
  const { getUserId } = useUser();
  const [status, setStatus] = useState("all");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const queryClient = useQueryClient();
  
  // Get all orders
  const { data: orders, isLoading } = useQuery({
    queryKey: ["user-orders"],
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
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Mutation for cancelling an order
  const cancelOrderMutation = useMutation({
    mutationFn: async (orderId) => {
      const { error } = await supabase
        .from("orders")
        .update({ status: "cancelled", updated_at: new Date().toISOString() })
        .eq("id", orderId);
      
      if (error) throw error;
      return orderId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user-orders"]);
      toast.success("Đơn hàng đã được hủy thành công!");
      setSelectedOrderId(null);
    },
    onError: (error) => {
      console.error("Error cancelling order:", error);
      toast.error("Không thể hủy đơn hàng. Vui lòng thử lại sau.");
    },
  });

  // Handle order cancellation
  const handleCancelOrder = (orderId) => {
    if (window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) {
      cancelOrderMutation.mutate(orderId);
    }
  };

  // View order details
  const handleViewOrderDetails = (orderId) => {
    setSelectedOrderId(orderId === selectedOrderId ? null : orderId);
  };

  const filteredOrders =
    status === "all"
      ? orders
      : orders?.filter((order) => order.status === status);

  if (isLoading) return <Spinner />;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 px-8 py-6 text-white">
        <h2 className="text-2xl font-bold flex items-center">
          <FaBoxOpen className="mr-3" /> Quản lý đơn hàng
        </h2>
        <p className="text-red-100 mt-1">Theo dõi và quản lý các đơn hàng của bạn</p>
      </div>
      
      {/* Filter tabs */}
      <div className="px-8 pt-6 pb-4">
        <div className="flex flex-wrap gap-3 mb-6">
          {Object.entries(STATUS_LABELS).map(([key, label]) => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-5 py-2.5 rounded-full border-2 text-sm font-medium transition-all duration-200 ${
                status === key
                  ? "bg-red-600 text-white border-red-600 shadow-md"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
              }`}
              onClick={() => setStatus(key)}
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
            <h3 className="text-gray-500 text-lg font-medium">Không có đơn hàng nào</h3>
            <p className="text-gray-400 mt-2">Các đơn hàng của bạn sẽ xuất hiện ở đây</p>
          </div>
        ) : (
          <div className="space-y-6 pb-4">
            {filteredOrders?.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div>
                    <div className="flex items-center mb-2">
                      <span className="text-gray-400 text-sm mr-2">Mã đơn hàng:</span>
                      <span className="font-semibold text-gray-700">#{order.id}</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      <span className="inline-block w-4 h-4 mr-1 bg-gray-200 rounded-full"></span>
                      Ngày đặt: {new Date(order.created_at).toLocaleDateString("vi-VN", { 
                        year: 'numeric', 
                        month: 'numeric', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  
                  <div className="md:text-right">
                    <span
                      className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-sm font-medium ${
                        STATUS_COLORS[order.status] || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {STATUS_ICONS[order.status] || <FaInfoCircle className="mr-2" />}
                      {STATUS_LABELS[order.status] || order.status}
                    </span>
                  </div>
                </div>
                
                {/* Order timeline */}
                {order.status !== 'cancelled' && order.status !== 'refunded' && (
                  <div className="mt-4 mb-4">
                    <div className="flex items-center w-full">
                      <div className={`h-2 flex-grow rounded-full flex ${
                        order.status === 'completed' ? 'bg-green-500' : 'bg-gray-200'
                      }`}>
                        <div 
                          className={`h-full rounded-full ${
                            order.status === 'pending' ? 'w-1/4 bg-yellow-500' : 
                            order.status === 'processing' ? 'w-2/4 bg-blue-500' : 
                            order.status === 'shipping' ? 'w-3/4 bg-indigo-500' : 
                            ''
                          }`}
                        ></div>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1 px-1">
                      <span>Đặt hàng</span>
                      <span>Xác nhận</span>
                      <span>Giao hàng</span>
                      <span>Hoàn thành</span>
                    </div>
                  </div>
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
                
                {/* Order details - show when expanded */}
                {selectedOrderId === order.id && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 bg-gray-50 rounded-lg p-4 overflow-hidden"
                  >
                    <h4 className="font-medium text-gray-700 mb-3">Chi tiết đơn hàng</h4>
                    
                    {/* Order items */}
                    <div className="space-y-3">
                      {order.items && order.items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between border-b border-gray-200 pb-2">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-white border border-gray-200 rounded flex items-center justify-center mr-3">
                              {item.image ? (
                                <img src={item.image} alt={item.product_name} className="w-8 h-8 object-contain" />
                              ) : (
                                <FaShoppingBag className="text-gray-400" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm text-gray-800">{item.product_name || `Sản phẩm ${index + 1}`}</p>
                              <p className="text-xs text-gray-500">SL: {item.quantity}</p>
                            </div>
                          </div>
                          <div className="text-sm font-medium text-gray-700">
                            {formatCurrency(item.price || 0)}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Order summary */}
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tạm tính:</span>
                        <span className="text-gray-800">{formatCurrency(order.subtotal || order.total_amount)}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-600">Phí vận chuyển:</span>
                        <span className="text-gray-800">{formatCurrency(order.shipping_fee || 0)}</span>
                      </div>
                      {order.discount > 0 && (
                        <div className="flex justify-between text-sm mt-1">
                          <span className="text-gray-600">Giảm giá:</span>
                          <span className="text-green-600">-{formatCurrency(order.discount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-medium mt-2 pt-2 border-t border-gray-200">
                        <span className="text-gray-700">Tổng cộng:</span>
                        <span className="text-red-600">{formatCurrency(order.total_amount)}</span>
                      </div>
                    </div>
                    
                    {/* Order status timeline */}
                    {order.status_history && (
                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Lịch sử trạng thái</h5>
                        <div className="space-y-2">
                          {order.status_history.map((statusItem, index) => (
                            <div key={index} className="flex items-start">
                              <div className="w-2 h-2 rounded-full bg-gray-400 mt-1.5 mr-2"></div>
                              <div className="text-xs">
                                <p className="text-gray-800">{STATUS_LABELS[statusItem.status]}</p>
                                <p className="text-gray-500">{new Date(statusItem.timestamp).toLocaleString("vi-VN")}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
                
                <div className="mt-5 flex justify-end gap-3">
                  {/* Only show cancel button for pending or processing orders */}
                  {(order.status === 'pending' || order.status === 'processing') && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="border border-red-500 text-red-600 px-5 py-2.5 rounded-lg text-sm font-medium transition-all hover:bg-red-50"
                      onClick={() => handleCancelOrder(order.id)}
                      disabled={cancelOrderMutation.isLoading}
                    >
                      {cancelOrderMutation.isLoading && order.id === cancelOrderMutation.variables ? (
                        <span className="flex items-center">
                          <div className="w-3 h-3 border-t-2 border-red-500 border-r-2 rounded-full animate-spin mr-2"></div>
                          Đang hủy...
                        </span>
                      ) : (
                        "Hủy đơn"
                      )}
                    </motion.button>
                  )}
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`${
                      selectedOrderId === order.id
                        ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow hover:shadow-lg"
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

export default UserOrders;
