import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  IoAlertCircleOutline,
  IoCheckmarkCircleOutline,
  IoTimeOutline,
  IoCartOutline,
  IoBagCheckOutline,
} from "react-icons/io5";

// Tạo context cho thông báo
const NotificationContext = createContext();

// Danh sách thông báo ban đầu
const initialNotifications = [
  {
    id: 1,
    title: "Đã thêm sản phẩm vào giỏ hàng",
    description: "Laptop Gaming ASUS TUF F15 đã được thêm vào giỏ hàng.",
    icon: <IoCartOutline className="text-xl" />,
    color: "text-blue-500",
    isNew: true,
    time: "5 phút trước"
  },
  {
    id: 2, 
    title: "Đơn hàng đã giao",
    description: "Đơn hàng ABC123 đã được giao thành công.",
    icon: <IoCheckmarkCircleOutline className="text-xl" />,
    color: "text-green-500",
    isNew: false,
    time: "1 giờ trước"
  }
];

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [newCount, setNewCount] = useState(1); // Số lượng thông báo mới

  // Thêm thông báo mới
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      ...notification,
      isNew: true,
      time: "Vừa xong"
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    setNewCount(prev => prev + 1);
    
    // Tùy chọn: tự động đánh dấu là đã đọc sau một khoảng thời gian
    setTimeout(() => {
      markAsRead(newNotification.id);
    }, 60000); // 1 phút
  };

  // Đánh dấu thông báo đã đọc
  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id && notification.isNew
          ? { ...notification, isNew: false }
          : notification
      )
    );
    // Cập nhật số lượng thông báo mới
    updateNewCount();
  };

  // Đánh dấu tất cả thông báo đã đọc
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isNew: false }))
    );
    setNewCount(0);
  };

  // Cập nhật số lượng thông báo mới
  const updateNewCount = () => {
    const count = notifications.filter(notification => notification.isNew).length;
    setNewCount(count);
  };

  // Thêm sản phẩm vào giỏ hàng và tạo thông báo
  const addToCart = (product) => {
    addNotification({
      title: "Đã thêm sản phẩm vào giỏ hàng",
      description: `${product.name || 'Sản phẩm'} đã được thêm vào giỏ hàng.`,
      icon: <IoCartOutline className="text-xl" />,
      color: "text-blue-500"
    });
  };

  // Tạo thông báo đặt hàng thành công
  const orderSuccess = (orderNumber) => {
    addNotification({
      title: "Đặt hàng thành công",
      description: `Đơn hàng ${orderNumber || 'của bạn'} đã được đặt thành công.`,
      icon: <IoBagCheckOutline className="text-xl" />,
      color: "text-green-600"
    });
  };

  // Tạo thông báo đang xử lý đơn hàng
  const orderProcessing = (orderNumber) => {
    addNotification({
      title: "Đơn hàng đang xử lý",
      description: `Đơn hàng ${orderNumber || 'của bạn'} đang được xử lý.`,
      icon: <IoTimeOutline className="text-xl" />,
      color: "text-yellow-500"
    });
  };

  // Cập nhật số lượng thông báo mới khi component được mount
  useEffect(() => {
    updateNewCount();
  }, []);

  const value = {
    notifications,
    newCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    addToCart,
    orderSuccess,
    orderProcessing
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Hook để sử dụng context
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext; 