import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/components/services/supabase";
import Spinner from "@/components/ui/Spinner";
import { formatCurrency } from "@/utils/format";

function UserHistory() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ["user-history"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "completed")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <Spinner />;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Lịch sử mua hàng
      </h2>
      {orders?.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Bạn chưa có đơn hàng hoàn thành nào</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders?.map((order) => (
            <div key={order.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm text-gray-500">
                    Mã đơn hàng: {order.id}
                  </p>
                  <p className="text-sm text-gray-500">
                    Ngày đặt:{" "}
                    {new Date(order.created_at).toLocaleDateString("vi-VN")}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Hoàn thành
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <div className="text-sm text-gray-700">
                  {order.items?.length || 0} sản phẩm
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-500">Tổng tiền:</span>
                  <span className="text-lg font-semibold text-red-600 ml-2">
                    {formatCurrency(order.total_amount)}
                  </span>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  className="px-4 py-2 rounded bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
                  onClick={() => alert("Xem chi tiết đơn hàng: " + order.id)}
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserHistory;
