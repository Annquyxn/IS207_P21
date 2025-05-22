import React from 'react';
import { motion } from 'framer-motion';
import { 
  MdInventory, 
  MdAttachMoney, 
  MdShoppingCart, 
  MdPeopleAlt,
  MdTrendingUp,
  MdStarRate 
} from 'react-icons/md';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Sales data for quick visualization
const salesData = [
  { day: 'CN', orders: 12, revenue: 8200 },
  { day: 'T2', orders: 19, revenue: 12400 },
  { day: 'T3', orders: 14, revenue: 9800 },
  { day: 'T4', orders: 21, revenue: 14200 },
  { day: 'T5', orders: 25, revenue: 16800 },
  { day: 'T6', orders: 32, revenue: 21500 },
  { day: 'T7', orders: 28, revenue: 19200 },
];

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

const Dashboard = () => {
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
          <select className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-medium">
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
          value="1,254"
          icon={<MdInventory />}
          change="5.3% so với tháng trước"
          changeType="increase"
        />
        <DashboardCard
          title="Tổng đơn hàng"
          value="846"
          icon={<MdShoppingCart />}
          change="8.2% so với tháng trước"
          changeType="increase"
        />
        <DashboardCard
          title="Tổng người dùng"
          value="3,157"
          icon={<MdPeopleAlt />}
          change="12.5% so với tháng trước"
          changeType="increase"
        />
        <DashboardCard
          title="Tổng doanh thu"
          value="₫233.4M"
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
                  data={salesData}
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
                  data={salesData}
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
                {[1, 2, 3, 4, 5].map((item, index) => (
                  <motion.div 
                    key={item} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
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
                        <p className="font-semibold text-gray-800">Đơn hàng mới #{Math.floor(Math.random() * 10000)}</p>
                        <span className="text-sm text-gray-500">2 giờ trước</span>
                      </div>
                      <p className="text-sm text-gray-600">Khách hàng: Nguyễn Văn A</p>
                      <p className="text-sm text-gray-600">Trị giá: ₫{Math.floor(Math.random() * 10000)}k</p>
                    </div>
                  </motion.div>
                ))}
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
                {[
                  { name: 'Dell XPS 13', sales: 42 },
                  { name: 'Logitech G502', sales: 38 },
                  { name: 'Samsung Odyssey G7', sales: 27 },
                  { name: 'Kingston 16GB RAM', sales: 24 },
                  { name: 'ASUS ROG Strix', sales: 21 }
                ].map((product, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
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
                      <MdTrendingUp className="text-green-500 mr-1" />
                      <span className="text-gray-600 font-medium">{product.sales}</span>
                    </div>
                  </motion.div>
                ))}
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
                {[1, 2, 3].map((item, index) => (
                  <motion.div 
                    key={item} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + (index * 0.1) }}
                    className="text-sm"
                  >
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-800">Khách hàng ẩn danh</span>
                      <motion.div 
                        className="flex text-yellow-500"
                        whileHover={{ scale: 1.1 }}
                      >
                        {Array.from({ length: 5 }).map((_, i) => (
                          <MdStarRate 
                            key={i} 
                            className={i < Math.floor(Math.random() * 3) + 3 ? '' : 'text-gray-300'} 
                          />
                        ))}
                      </motion.div>
                    </div>
                    <p className="text-gray-600 mt-1 line-clamp-2 leading-relaxed">
                      Sản phẩm tốt, giao hàng nhanh, đóng gói cẩn thận. Rất hài lòng với trải nghiệm mua hàng.
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
