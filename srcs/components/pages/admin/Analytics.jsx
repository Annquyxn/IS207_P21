import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis
} from 'recharts';

// Sales data for the year
const salesData = [
  { name: 'T1', revenue: 12400, profit: 4240, orders: 42 },
  { name: 'T2', revenue: 14800, profit: 5340, orders: 53 },
  { name: 'T3', revenue: 18600, profit: 7240, orders: 75 },
  { name: 'T4', revenue: 15200, profit: 5240, orders: 56 },
  { name: 'T5', revenue: 22100, profit: 8240, orders: 86 },
  { name: 'T6', revenue: 19800, profit: 7640, orders: 78 },
  { name: 'T7', revenue: 17500, profit: 6240, orders: 68 },
  { name: 'T8', revenue: 16800, profit: 5840, orders: 62 },
  { name: 'T9', revenue: 18200, profit: 6940, orders: 70 },
  { name: 'T10', revenue: 20400, profit: 7840, orders: 84 },
  { name: 'T11', revenue: 24800, profit: 9640, orders: 98 },
  { name: 'T12', revenue: 32600, profit: 12840, orders: 124 }
];

// Product category data
const categoryData = [
  { name: 'Laptop', value: 35 },
  { name: 'Bàn phím', value: 20 },
  { name: 'Chuột', value: 15 },
  { name: 'Màn hình', value: 18 },
  { name: 'Linh kiện', value: 12 }
];

// Customer behavior data for scatter plot
const customerData = [
  { age: 22, spending: 1200, visits: 8, id: 1 },
  { age: 25, spending: 2400, visits: 12, id: 2 },
  { age: 30, spending: 3200, visits: 6, id: 3 },
  { age: 35, spending: 5600, visits: 8, id: 4 },
  { age: 40, spending: 4800, visits: 5, id: 5 },
  { age: 19, spending: 800, visits: 10, id: 6 },
  { age: 28, spending: 2800, visits: 15, id: 7 },
  { age: 33, spending: 4200, visits: 9, id: 8 },
  { age: 45, spending: 6800, visits: 4, id: 9 },
  { age: 52, spending: 5400, visits: 3, id: 10 },
  { age: 24, spending: 1600, visits: 11, id: 11 },
  { age: 37, spending: 4900, visits: 7, id: 12 },
  { age: 42, spending: 5100, visits: 6, id: 13 },
  { age: 31, spending: 3700, visits: 8, id: 14 },
  { age: 27, spending: 2300, visits: 14, id: 15 }
];

// Customer retention data for additional analysis
const retentionData = [
  { month: 'T1', newUsers: 120, returningUsers: 80 },
  { month: 'T2', newUsers: 140, returningUsers: 90 },
  { month: 'T3', newUsers: 160, returningUsers: 110 },
  { month: 'T4', newUsers: 180, returningUsers: 130 },
  { month: 'T5', newUsers: 190, returningUsers: 150 },
  { month: 'T6', newUsers: 170, returningUsers: 160 },
];

// Color palette
const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#10b981', '#3b82f6'];
const SCATTER_COLORS = ['#ef4444', '#3b82f6', '#10b981'];

// Animation variants
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
const AnalyticsCard = ({ title, value, icon, change, changeType }) => {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
      className="bg-white p-6 rounded-xl shadow-md border border-gray-100 transition-all duration-300"
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
        <motion.div 
          className="p-3 bg-red-50 rounded-lg"
          whileHover={{ rotate: 10, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            {icon}
          </svg>
        </motion.div>
      </div>
    </motion.div>
  );
};

const Analytics = () => {
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
          <h1 className="text-3xl font-bold text-gray-800 font-sans tracking-tight">Phân tích bán hàng</h1>
          <p className="text-gray-500 mt-1 font-medium leading-relaxed">Theo dõi hiệu suất kinh doanh và hành vi khách hàng</p>
        </motion.div>
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex flex-wrap gap-3"
        >
          <select className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-medium">
            <option value="2023">Năm 2023</option>
            <option value="2022">Năm 2022</option>
            <option value="2021">Năm 2021</option>
          </select>
          <motion.button 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-md text-sm hover:from-red-700 hover:to-red-600 transition font-medium shadow-md"
          >
            Xuất báo cáo
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
        <AnalyticsCard
          title="Doanh thu"
          value="₫233.4M"
          icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
          change="12.5% so với tháng trước"
          changeType="increase"
        />
        <AnalyticsCard
          title="Đơn hàng"
          value="846"
          icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />}
          change="8.2% so với tháng trước"
          changeType="increase"
        />
        <AnalyticsCard
          title="Khách hàng mới"
          value="248"
          icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />}
          change="3.1% so với tháng trước"
          changeType="decrease"
        />
        <AnalyticsCard
          title="Lợi nhuận"
          value="₫81.2M"
          icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />}
          change="14.3% so với tháng trước"
          changeType="increase"
        />
      </motion.div>

      {/* Customer Analysis Section */}
      <div className="mb-8">
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-gray-800 mb-4 font-sans tracking-tight border-b pb-2"
        >
          Phân tích khách hàng
        </motion.h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customer Behavior Scatter Plot */}
          <motion.div
            variants={chartVariants}
            initial="hidden"
            animate="show"
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 font-sans">Hành vi chi tiêu theo tuổi</h3>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                  <XAxis 
                    type="number" 
                    dataKey="age" 
                    name="Tuổi" 
                    label={{ value: 'Tuổi', position: 'insideBottomRight', offset: -5, style: { fontFamily: 'sans-serif', textAnchor: 'end' } }}
                    tick={{ fontFamily: 'sans-serif', fontSize: 12 }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="spending" 
                    name="Chi tiêu" 
                    label={{ value: 'Chi tiêu (VNĐ)', angle: -90, position: 'insideLeft', style: { fontFamily: 'sans-serif', textAnchor: 'middle' } }}
                    tickFormatter={(value) => `${value/1000}k`}
                    tick={{ fontFamily: 'sans-serif', fontSize: 12 }}
                  />
                  <ZAxis 
                    type="number" 
                    dataKey="visits" 
                    range={[50, 400]} 
                    name="Lượt truy cập" 
                  />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    formatter={(value, name) => {
                      if (name === 'Chi tiêu') return [`${value.toLocaleString()} ₫`, name];
                      return [value, name];
                    }}
                    labelFormatter={(value) => `Tuổi: ${value}`}
                    contentStyle={{ 
                      fontFamily: 'sans-serif',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      border: 'none'
                    }}
                  />
                  <Legend wrapperStyle={{ fontFamily: 'sans-serif', fontSize: 12 }} />
                  <Scatter 
                    name="Khách hàng" 
                    data={customerData} 
                    fill="#ef4444" 
                    fillOpacity={0.7}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-gray-600 mt-2 italic leading-relaxed">
              Kích thước điểm biểu thị số lần ghé thăm cửa hàng
            </p>
          </motion.div>

          {/* Customer Retention Chart */}
          <motion.div
            variants={chartVariants}
            initial="hidden"
            animate="show"
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 font-sans">Khách hàng mới và quay lại</h3>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={retentionData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                  <XAxis dataKey="month" tick={{ fontFamily: 'sans-serif', fontSize: 12 }} />
                  <YAxis tick={{ fontFamily: 'sans-serif', fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value) => [`${value}`, '']}
                    contentStyle={{ 
                      fontFamily: 'sans-serif',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      border: 'none'
                    }}
                  />
                  <Legend wrapperStyle={{ fontFamily: 'sans-serif', fontSize: 12 }} />
                  <Bar 
                    dataKey="newUsers" 
                    name="Khách hàng mới" 
                    stackId="a" 
                    fill="#3b82f6" 
                    radius={[4, 4, 0, 0]}
                    animationDuration={1500}
                  />
                  <Bar 
                    dataKey="returningUsers" 
                    name="Khách hàng quay lại" 
                    stackId="a" 
                    fill="#10b981" 
                    radius={[4, 4, 0, 0]}
                    animationDuration={1500}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Business Performance Charts */}
      <div>
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-gray-800 mb-4 font-sans tracking-tight border-b pb-2"
        >
          Hiệu suất kinh doanh
        </motion.h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            variants={chartVariants}
            initial="hidden"
            animate="show"
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 font-sans">Doanh thu & lợi nhuận</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={salesData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                  <XAxis dataKey="name" tick={{ fontFamily: 'sans-serif', fontSize: 12 }} />
                  <YAxis 
                    tickFormatter={(value) => `${value/1000}k`} 
                    tick={{ fontFamily: 'sans-serif', fontSize: 12 }}
                  />
                  <Tooltip 
                    formatter={(value) => [`₫${value.toLocaleString()}`, '']}
                    contentStyle={{ 
                      fontFamily: 'sans-serif',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      border: 'none'
                    }}
                  />
                  <Legend wrapperStyle={{ fontFamily: 'sans-serif', fontSize: 12 }} />
                  <Bar 
                    dataKey="revenue" 
                    name="Doanh thu" 
                    fill="#ef4444" 
                    radius={[4, 4, 0, 0]}
                    animationDuration={1500}
                  />
                  <Bar 
                    dataKey="profit" 
                    name="Lợi nhuận" 
                    fill="#10b981" 
                    radius={[4, 4, 0, 0]}
                    animationDuration={1500}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            variants={chartVariants}
            initial="hidden"
            animate="show"
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 font-sans">Xu hướng đơn hàng</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={salesData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                  <XAxis dataKey="name" tick={{ fontFamily: 'sans-serif', fontSize: 12 }} />
                  <YAxis tick={{ fontFamily: 'sans-serif', fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value) => [value, '']}
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
                    dataKey="orders" 
                    name="Số đơn hàng" 
                    stroke="#3b82f6" 
                    activeDot={{ r: 8, fill: '#3b82f6', stroke: 'white', strokeWidth: 2 }}
                    dot={{ r: 4, fill: 'white', stroke: '#3b82f6', strokeWidth: 2 }}
                    strokeWidth={3}
                    animationDuration={1500}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            variants={chartVariants}
            initial="hidden"
            animate="show"
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 font-sans">Danh mục sản phẩm bán chạy</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    animationDuration={1500}
                    animationBegin={200}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value}%`, '']}
                    contentStyle={{ 
                      fontFamily: 'sans-serif',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      border: 'none'
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ fontFamily: 'sans-serif', fontSize: 12 }}
                    formatter={(value, entry) => <span style={{ color: '#333', fontFamily: 'sans-serif' }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            variants={chartVariants}
            initial="hidden"
            animate="show"
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 font-sans">Phát triển doanh thu</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={salesData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                  <XAxis dataKey="name" tick={{ fontFamily: 'sans-serif', fontSize: 12 }} />
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
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#ef4444" 
                    fill="#fee2e2" 
                    strokeWidth={2}
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Analytics; 