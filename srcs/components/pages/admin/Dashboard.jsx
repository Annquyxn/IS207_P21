import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MdInventory,
  MdAttachMoney,
  MdShoppingCart,
  MdPeopleAlt,
  MdTrendingUp,
  MdStarRate 
} from 'react-icons/md';
import { 
  BarChart, Bar, LineChart, Line, 
  XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer 
} from 'recharts';
import {
  getProductCount,
  getTotalRevenue,
  getOrderCount,
  getUserCount,
  getRevenueByMonth,
  getTopProductPerformance
} from '@/components/features/products/apiProduct';
import Spinner from '@/components/ui/Spinner';

// Animation variants for cards
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { 
    y: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20
    }
  }
};

const chartVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

// Format currency to Vietnamese format
function formatCurrency(amount) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

// Dashboard Card Component
const DashboardCard = ({ title, value, icon, change, changeType }) => {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all duration-300"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-3xl font-bold text-gray-800 mt-2 font-sans tracking-tight">{value}</h3>
          {change && (
            <p className={`text-xs font-medium ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'} mt-2 flex items-center`}>
              <span className="mr-1">{changeType === 'increase' ? '▲' : '▼'}</span> {change}
            </p>
          )}
        </div>
        <div className="p-3 bg-red-50 rounded-lg text-red-600 text-2xl">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {icon}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

// Star Rating Component with unique keys
const StarRating = ({ rating }) => {
  return (
    <div className="flex text-yellow-500">
      {[1, 2, 3, 4, 5].map((star) => (
        <MdStarRate 
          key={`star-${star}`} 
          className={star <= rating ? '' : 'text-gray-300'} 
        />
      ))}
    </div>
  );
};

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [dashboardStats, setDashboardStats] = useState({
    productCount: 0,
    orderCount: 0,
    userCount: 0,
    revenue: 0,
    topProducts: [],
    weeklyData: []
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch dashboard statistics
  useEffect(() => {
    const fetchDashboardStats = async () => {
      setIsLoading(true);
      try {
        const products = await getProductCount();
        const orders = await getOrderCount();
        const users = await getUserCount();
        const revenue = await getTotalRevenue();
        const topProducts = await getTopProductPerformance();
        const monthlyRevenue = await getRevenueByMonth();
        
        // Get last 7 days of data for weekly chart (simplified for demo)
        const weeklyData = [
          { day: 'CN', orders: 12, revenue: 8200 },
          { day: 'T2', orders: 19, revenue: 12400 },
          { day: 'T3', orders: 14, revenue: 9800 },
          { day: 'T4', orders: 21, revenue: 14200 },
          { day: 'T5', orders: 25, revenue: 16800 },
          { day: 'T6', orders: 32, revenue: 21500 },
          { day: 'T7', orders: 28, revenue: 19200 },
        ];

        setDashboardStats({
          productCount: products,
          orderCount: orders,
          userCount: users,
          revenue: formatCurrency(revenue),
          topProducts,
          weeklyData,
          monthlyRevenue: monthlyRevenue.map((value, index) => ({
            name: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'][index],
            value: value / 1000000 // Convert to millions
          }))
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  // Format currency helper
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value).replace(/\s/g, '');
  };

  // Format date helper
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });
  };

  // Mock recent orders - in a real app, these would come from an API
  const recentOrders = [
    { id: 1, orderNumber: 8701, customerName: "Nguyễn Văn A", value: 2500000, time: "2 giờ trước" },
    { id: 2, orderNumber: 8695, customerName: "Trần Thị B", value: 4800000, time: "3 giờ trước" },
    { id: 3, orderNumber: 8692, customerName: "Lê Văn C", value: 1200000, time: "5 giờ trước" },
    { id: 4, orderNumber: 8688, customerName: "Phạm Thị D", value: 3600000, time: "6 giờ trước" },
    { id: 5, orderNumber: 8684, customerName: "Hoàng Văn E", value: 7200000, time: "8 giờ trước" },
  ];

  // Mock reviews with fixed star ratings
  const recentReviews = [
    { id: 1, customer: "Khách hàng ẩn danh", rating: 5, comment: "Sản phẩm tốt, giao hàng nhanh, đóng gói cẩn thận. Rất hài lòng với trải nghiệm mua hàng." },
    { id: 2, customer: "Khách hàng ẩn danh", rating: 4, comment: "Chất lượng sản phẩm tốt, nhưng giao hàng hơi chậm. Nhìn chung là hài lòng." },
    { id: 3, customer: "Khách hàng ẩn danh", rating: 5, comment: "Giá cả hợp lý, dịch vụ khách hàng rất tốt. Sẽ quay lại lần sau." },
  ];

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl font-bold text-gray-800 font-sans tracking-tight">Tổng quan</h1>
          <p className="text-gray-500 mt-1 font-medium leading-relaxed">Theo dõi hiệu suất kinh doanh trong thời gian thực</p>
        </motion.div>
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex flex-wrap gap-3"
        >
          <select 
            className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="today">Hôm nay</option>
            <option value="week">Tuần này</option>
            <option value="month">Tháng này</option>
            <option value="year">Năm nay</option>
          </select>
          <motion.button 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-md text-sm hover:from-red-700 hover:to-red-600 transition font-medium shadow-md"
          >
            Làm mới
          </motion.button>
        </motion.div>
      </div>

      {/* Summary Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <DashboardCard
          title="Tổng sản phẩm"
          value={dashboardStats.productCount.toLocaleString()}
          icon={<MdInventory />}
          change="5.3% so với tháng trước"
          changeType="increase"
        />
        <DashboardCard
          title="Tổng đơn hàng"
          value={dashboardStats.orderCount.toLocaleString()}
          icon={<MdShoppingCart />}
          change="8.2% so với tháng trước"
          changeType="increase"
        />
        <DashboardCard
          title="Tổng người dùng"
          value={dashboardStats.userCount.toLocaleString()}
          icon={<MdPeopleAlt />}
          change="12.5% so với tháng trước"
          changeType="increase"
        />
        <DashboardCard
          title="Tổng doanh thu"
          value={dashboardStats.revenue}
          icon={<MdAttachMoney />}
          change="14.3% so với tháng trước"
          changeType="increase"
        />
      </motion.div>

      {/* Quick Charts Section */}
      <div>
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-gray-800 mb-4 font-sans tracking-tight border-b pb-2"
        >
          Thống kê tuần này
        </motion.h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Orders Chart */}
          <motion.div
            variants={chartVariants}
            initial="hidden"
            animate="show"
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 font-sans">Đơn hàng theo ngày</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dashboardStats.weeklyData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
                  <XAxis dataKey="day" tick={{ fontFamily: 'sans-serif', fontSize: 12 }} />
                  <YAxis tick={{ fontFamily: 'sans-serif', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      fontFamily: 'sans-serif',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      border: 'none'
                    }}
                  />
                  <Legend wrapperStyle={{ fontFamily: 'sans-serif', fontSize: 12 }} />
                  <Bar 
                    dataKey="orders" 
                    name="Số đơn hàng" 
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                    animationDuration={1500}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Revenue Chart */}
          <motion.div
            variants={chartVariants}
            initial="hidden"
            animate="show"
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 font-sans">Doanh thu theo ngày</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={dashboardStats.weeklyData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                  <XAxis dataKey="day" tick={{ fontFamily: 'sans-serif', fontSize: 12 }} />
                  <YAxis 
                    tickFormatter={(value) => `${value/1000}k`} 
                    tick={{ fontFamily: 'sans-serif', fontSize: 12 }}
                  />
                  <Tooltip 
                    formatter={(value) => [`₫${value.toLocaleString()}`, 'Doanh thu']}
                    contentStyle={{ 
                      fontFamily: 'sans-serif',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      border: 'none'
                    }}
                  />
                  <Legend wrapperStyle={{ fontFamily: 'sans-serif', fontSize: 12 }} />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    name="Doanh thu" 
                    stroke="#ef4444" 
                    strokeWidth={3}
                    activeDot={{ r: 8, fill: '#ef4444', stroke: 'white', strokeWidth: 2 }}
                    dot={{ r: 4, fill: 'white', stroke: '#ef4444', strokeWidth: 2 }}
                    animationDuration={1500}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div>
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-gray-800 mb-4 font-sans tracking-tight border-b pb-2"
        >
          Hoạt động gần đây
        </motion.h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 font-sans">Đơn hàng mới</h3>
                <motion.button 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                  className="text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  Xem tất cả
                </motion.button>
              </div>
              
              <div className="space-y-4">
                <AnimatePresence mode="sync">
                  {recentOrders.map((order, index) => (
                    <motion.div 
                      key={`order-${order.id}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ delay: 0.5 + (index * 0.1) }}
                      className="flex items-start border-b border-gray-100 pb-4"
                    >
                      <motion.div 
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 mr-3"
                      >
                        <MdShoppingCart />
                      </motion.div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="font-semibold text-gray-800">Đơn hàng mới #{order.orderNumber}</p>
                          <span className="text-sm text-gray-500">{order.time}</span>
                        </div>
                        <p className="text-sm text-gray-600">Khách hàng: {order.customerName}</p>
                        <p className="text-sm text-gray-600">Trị giá: {formatCurrency(order.value)}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-100 transition-all duration-300"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 font-sans">Sản phẩm bán chạy</h3>
                <motion.button 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                  className="text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  Xem tất cả
                </motion.button>
              </div>
              
              <div className="space-y-4">
                <AnimatePresence mode="sync">
                  {dashboardStats.topProducts.map((product, index) => (
                    <motion.div 
                      key={`product-${index}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: 0.6 + (index * 0.1) }}
                      whileHover={{ x: 5 }}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center mr-3">
                          <span className="font-medium text-gray-700">{index + 1}</span>
                        </div>
                        <span className="text-gray-800 font-medium">{product.name}</span>
                      </div>
                      <div className="flex items-center">
                        <MdTrendingUp className={product.growth > 0 ? "text-green-500 mr-1" : "text-red-500 mr-1"} />
                        <span className="text-gray-600 font-medium">{product.sales}</span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mt-6 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 font-sans">Đánh giá gần đây</h3>
                <div className="flex items-center text-yellow-500">
                  <MdStarRate />
                  <MdStarRate />
                  <MdStarRate />
                  <MdStarRate />
                  <MdStarRate className="text-gray-300" />
                  <span className="ml-1 text-gray-700 font-medium">4.2</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <AnimatePresence mode="sync">
                  {recentReviews.map((review, index) => (
                    <motion.div 
                      key={`review-${review.id}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ delay: 0.8 + (index * 0.1) }}
                      className="text-sm"
                    >
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-800">{review.customer}</span>
                        <motion.div whileHover={{ scale: 1.1 }}>
                          <StarRating rating={review.rating} />
                        </motion.div>
                      </div>
                      <p className="text-gray-600 mt-1 line-clamp-2 leading-relaxed">
                        {review.comment}
                      </p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
