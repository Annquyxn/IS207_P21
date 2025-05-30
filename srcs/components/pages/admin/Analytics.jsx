import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis, ComposedChart
} from 'recharts';
import {
  getRevenueByMonth,
  getTopProductPerformance,
  getRegionalDistribution,
  getProfitByMonth,
  getTotalRevenue,
  getOrderCount,
  getOrderStatsByStatus,
  getRevenueByRecentDays
} from '@/components/features/products/apiProduct';
import Spinner from '@/components/ui/Spinner';
import { toast } from 'react-hot-toast';
import html2canvas from 'html2canvas';

const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#10b981', '#3b82f6'];
const SCATTER_COLORS = ['#ef4444', '#3b82f6', '#10b981'];

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

const getYearOptions = () => {
  const currentYear = new Date().getFullYear();
  return [currentYear, currentYear - 1, currentYear - 2];
};

const Analytics = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [salesData, setSalesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [selectedYear, setSelectedYear] = useState('2023');
  const [summaryMetrics, setSummaryMetrics] = useState({
    revenue: "0",
    orders: 0,
    newCustomers: 0,
    profit: "0"
  });
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [recentDaysData, setRecentDaysData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [regionalData, setRegionalData] = useState([]);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch by selected year
        const year = parseInt(selectedYear);
        // Revenue by month
        const monthlyRevenue = await getRevenueByMonth(year);
        const monthlyProfit = await getProfitByMonth(year);
        
        const formattedSalesData = monthlyRevenue.map((revenue, index) => {
          // Get profit from the API response
          const profit = monthlyProfit[index] || Math.round(revenue * 0.35);
          const avgOrderValue = 2500000;
          const orders = Math.round(revenue / avgOrderValue);
          
          return {
            name: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'][index],
            revenue: Math.round(revenue / 1000000),
            profit: Math.round(profit / 1000000),
            orders
          };
        });
        
        setSalesData(formattedSalesData);
        
        const topProductsData = await getTopProductPerformance(10);
        
        const categorySales = {};
        topProductsData.forEach(product => {
          const category = product.category || product.name.split(' ')[0] || 'Khác';
          if (!categorySales[category]) {
            categorySales[category] = 0;
          }
          categorySales[category] += product.sales || 0;
        });
        
        const formattedCategoryData = Object.entries(categorySales).map(([name, value]) => ({
          name,
          value
        }));
        
        setCategoryData(formattedCategoryData);
        
        await getRegionalDistribution();
        
        // Set summary metrics
        const totalRevenue = await getTotalRevenue();
        const totalOrders = await getOrderCount();
        
        setSummaryMetrics({
          revenue: `₫${Math.round(totalRevenue / 1000000).toLocaleString()}M`,
          orders: totalOrders,
          newCustomers: 0,
          profit: `₫${Math.round((totalRevenue * 0.35) / 1000000).toLocaleString()}M`
        });
        
        // Order status distribution
        const statusData = await getOrderStatsByStatus();
        setOrderStatusData(statusData);
        // Revenue by recent days
        const recentData = await getRevenueByRecentDays(7);
        setRecentDaysData(recentData);
        // Top products
        setTopProducts(topProductsData);
        // Regional distribution
        const regionData = await getRegionalDistribution();
        setRegionalData(regionData);
        
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        setError('Không thể tải dữ liệu phân tích. Vui lòng thử lại sau.');
        toast.error('Lỗi kết nối dữ liệu!');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAnalyticsData();
  }, [selectedYear]); // Re-fetch when year changes

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner size="lg" />
      </div>
    );
  }

  // Export report handler
  const handleExportReport = async () => {
    const element = document.getElementById('analytics-report');
    if (!element) return;
    const canvas = await html2canvas(element);
    const link = document.createElement('a');
    link.download = `bao_cao_phan_tich_${selectedYear}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <motion.div
      id="analytics-report"
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
          <select 
            className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            {getYearOptions().map((year) => (
              <option key={year} value={year}>{`Năm ${year}`}</option>
            ))}
          </select>
          <motion.button 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-md text-sm hover:from-red-700 hover:to-red-600 transition font-medium shadow-md"
            onClick={handleExportReport}
          >
            Xuất báo cáo
          </motion.button>
        </motion.div>
      </div>

      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                {error} <button onClick={() => window.location.reload()} className="font-medium underline">Tải lại trang</button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <AnalyticsCard
          title="Doanh thu"
          value={summaryMetrics.revenue}
          icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
          change="12.5% so với tháng trước"
          changeType="increase"
        />
        <AnalyticsCard
          title="Đơn hàng"
          value={summaryMetrics.orders.toString()}
          icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />}
          change="8.2% so với tháng trước"
          changeType="increase"
        />
        <AnalyticsCard
          title="Khách hàng mới"
          value={summaryMetrics.newCustomers.toString()}
          icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />}
          change="3.1% so với tháng trước"
          changeType="decrease"
        />
        <AnalyticsCard
          title="Lợi nhuận"
          value={summaryMetrics.profit}
          icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />}
          change="14.3% so với tháng trước"
          changeType="increase"
        />
      </motion.div>

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
                    formatter={(value) => <span style={{ color: '#333', fontFamily: 'sans-serif' }}>{value}</span>}
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

      {/* New: Order Status Distribution Chart */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 font-sans">Tỷ lệ trạng thái đơn hàng</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={orderStatusData}
              dataKey="count"
              nameKey="status"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={false}
              labelLine={false}
            >
              {orderStatusData.map((entry, index) => (
                <Cell key={`cell-status-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend layout="vertical" verticalAlign="middle" align="right" />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* New: Revenue & Orders by Recent Days */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 font-sans">Doanh thu & Đơn hàng 7 ngày gần nhất</h3>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={recentDaysData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis yAxisId="left" orientation="left" tickFormatter={(v) => `${v/1000}k`} />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="right" dataKey="orders" name="Đơn hàng" fill="#3b82f6" />
            <Line yAxisId="left" type="monotone" dataKey="revenue" name="Doanh thu" stroke="#ef4444" strokeWidth={2} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* New: Top Products Bar Chart */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 font-sans">Top sản phẩm bán chạy</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topProducts} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={150} />
            <Tooltip />
            <Legend />
            <Bar dataKey="sales" name="Số lượng bán" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* New: Regional Distribution Pie Chart */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 font-sans">Phân bố đơn hàng theo khu vực</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={regionalData}
              dataKey="percentage"
              nameKey="region"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={false}
              labelLine={false}
            >
              {regionalData.map((entry, index) => (
                <Cell key={`cell-region-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend layout="vertical" verticalAlign="middle" align="right" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default Analytics; 