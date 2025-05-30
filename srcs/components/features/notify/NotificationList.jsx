import NotificationItem from "./NotificationItem";
import { useNotifications } from "./NotificationContext";
import {
  IoAlertCircleOutline,
  IoCheckmarkCircleOutline,
  IoTimeOutline,
  IoCartOutline,
  IoBagCheckOutline,
} from "react-icons/io5";

export default function NotificationList() {
  // Sử dụng context thay vì local state
  const { 
    notifications, 
    newCount: newNotificationsCount, 
    markAsRead,
    markAllAsRead 
  } = useNotifications();

  return (
    <div className="absolute top-full right-0 mt-2 w-96 bg-white shadow-lg rounded-xl overflow-hidden z-50">
      <div className="bg-red-600 text-white p-3 flex justify-between items-center">
        <h3 className="font-bold">Thông báo của bạn</h3>
        {newNotificationsCount > 0 && (
          <span className="bg-white text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
            {newNotificationsCount} mới
          </span>
        )}
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {notifications.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {notifications.map((item) => (
              <div key={item.id} onClick={() => markAsRead(item.id)}>
                <NotificationItem 
                  {...item} 
                  className={item.isNew ? "bg-blue-50" : ""}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-gray-500">
            Không có thông báo nào
          </div>
        )}
      </div>
      
      <div className="p-2 bg-gray-50 text-center">
        <button 
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          onClick={markAllAsRead}
        >
          Đánh dấu tất cả là đã đọc
        </button>
      </div>
    </div>
  );
}
