import NotificationItem from "./NotificationItem";
import {
  IoAlertCircleOutline,
  IoCheckmarkCircleOutline,
  IoTimeOutline,
  IoInformationCircleOutline,
  IoWarningOutline,
} from "react-icons/io5";

export default function NotificationList() {
  const notifications = [
    {
      title: "Đơn hàng đã giao",
      description: "Đơn hàng ABC123 đã được giao thành công.",
      icon: <IoCheckmarkCircleOutline className="text-xl" />,
      color: "text-green-500",
    },
    {
      title: "Đơn hàng bị hủy",
      description: "Đơn hàng XYZ456 đã bị hủy bởi người bán.",
      icon: <IoAlertCircleOutline className="text-xl" />,
      color: "text-red-500",
    },
    {
      title: "Đơn hàng đang xử lý",
      description: "Đơn hàng DEF789 đang được xử lý.",
      icon: <IoTimeOutline className="text-xl" />,
      color: "text-yellow-500",
    },
    {
      title: "Cập nhật tài khoản",
      description: "Thông tin tài khoản của bạn đã được cập nhật.",
      icon: <IoInformationCircleOutline className="text-xl" />,
      color: "text-blue-500",
    },
    {
      title: "Khuyến mãi mới",
      description: "Bạn vừa nhận được mã giảm giá 50k cho đơn hàng tiếp theo!",
      icon: <IoCheckmarkCircleOutline className="text-xl" />,
      color: "text-green-600",
    },
    {
      title: "Hết hạn đăng nhập",
      description:
        "Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại.",
      icon: <IoWarningOutline className="text-xl" />,
      color: "text-orange-500",
    },
    {
      title: "Lỗi thanh toán",
      description: "Thanh toán cho đơn hàng GHI321 không thành công.",
      icon: <IoAlertCircleOutline className="text-xl" />,
      color: "text-red-600",
    },
  ];

  return (
    <div className="absolute top-full right-0 mt-2 w-96 bg-white shadow-lg rounded-xl p-4 z-50">
      <div className="max-h-80 overflow-y-auto space-y-2">
        {notifications.map((item, index) => (
          <NotificationItem key={index} {...item} />
        ))}
      </div>
    </div>
  );
}
