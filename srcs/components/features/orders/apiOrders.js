import { supabase } from '@/components/services/supabase';

/**
 * Thêm đơn hàng mới vào Supabase
 * 
 * @param {Object} orderData - Dữ liệu đơn hàng
 * @param {Object} addressData - Dữ liệu địa chỉ giao hàng
 * @param {string} paymentMethod - Phương thức thanh toán
 * @param {Object} product - Thông tin sản phẩm
 * @param {Object|null} discount - Thông tin giảm giá (nếu có)
 * @returns {Promise<Object>} - Kết quả thêm đơn hàng
 */
export async function insertOrder({
  addressData,
  paymentMethod,
  product,
  discount = null
}) {
  try {
    // Format dữ liệu để lưu vào Supabase
    const orderData = {
      customer_name: addressData.fullName,
      gender: addressData.gender,
      phone: addressData.phone,
      address: {
        city: addressData.city,
        district: addressData.district,
        ward: addressData.ward,
        street: addressData.street,
        note: addressData.note || '',
      },
      shipping_method: addressData.shippingMethod,
      payment_method: paymentMethod,
      product_info: {
        id: product.id,
        title: product.title,
        image: product.image,
        price: product.salePrice,
        original_price: product.originalPrice || '',
        quantity: product.quantity || 1,
      },
      product_price: parsePrice(product.salePrice) * (product.quantity || 1),
      shipping_fee: calculateShippingFee(addressData.shippingMethod, parsePrice(product.salePrice)),
      discount: discount ? discount.amount : 0,
      discount_code: discount ? discount.code : '',
      status: 'pending', // Trạng thái mặc định khi tạo đơn hàng
      order_date: new Date().toISOString(),
    };

    // Tính tổng tiền
    orderData.total = 
      orderData.product_price + 
      orderData.shipping_fee - 
      orderData.discount;

    const { data, error } = await supabase
      .from('orders')
      .insert([orderData])
      .select();

    if (error) {
      console.error('Lỗi khi thêm đơn hàng:', error.message);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Lỗi khi thêm đơn hàng:', error.message);
    throw error;
  }
}

/**
 * Chuyển đổi giá từ chuỗi sang số
 * 
 * @param {string} priceStr - Chuỗi giá (VD: "1.990.000₫")
 * @returns {number} - Giá dạng số
 */
function parsePrice(priceStr) {
  if (!priceStr) return 0;
  return parseInt(priceStr.replace(/[^\d]/g, ''));
}

/**
 * Tính phí vận chuyển dựa trên phương thức giao hàng và giá sản phẩm
 * 
 * @param {string} shippingMethod - Phương thức vận chuyển (standard/express)
 * @param {number} productPrice - Giá sản phẩm
 * @returns {number} - Phí vận chuyển
 */
function calculateShippingFee(shippingMethod, productPrice) {
  // Miễn phí vận chuyển cho đơn hàng từ 500.000đ
  if (productPrice >= 500000) return 0;
  
  // Phí vận chuyển tiêu chuẩn và nhanh
  return shippingMethod === 'standard' ? 30000 : 50000;
}

/**
 * Lấy danh sách đơn hàng
 * 
 * @param {string} phoneNumber - Số điện thoại khách hàng
 * @returns {Promise<Array>} - Danh sách đơn hàng
 */
export async function getOrdersByPhone(phoneNumber) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('phone', phoneNumber)
      .order('order_date', { ascending: false });

    if (error) {
      console.error('Lỗi khi lấy đơn hàng:', error.message);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Lỗi khi lấy đơn hàng:', error.message);
    throw error;
  }
}

/**
 * Map thành phố/tỉnh thành sang khu vực
 * 
 * @param {string} city - Tên thành phố/tỉnh
 * @returns {string} - Tên khu vực (Bắc/Trung/Nam/Tây)
 */
function mapCityToRegion(city) {
  const northCities = ['Hà Nội', 'Hải Phòng', 'Quảng Ninh', 'Bắc Ninh', 'Hải Dương', 'Nam Định', 'Thái Bình'];
  const centralCities = ['Đà Nẵng', 'Huế', 'Quảng Nam', 'Quảng Ngãi', 'Bình Định', 'Phú Yên', 'Khánh Hòa'];
  const southCities = ['Hồ Chí Minh', 'Bình Dương', 'Đồng Nai', 'Bà Rịa - Vũng Tàu', 'Long An', 'Tiền Giang', 'Cần Thơ'];
  const westCities = ['An Giang', 'Kiên Giang', 'Cà Mau', 'Bạc Liêu', 'Sóc Trăng', 'Trà Vinh', 'Bến Tre'];

  if (!city) return 'Bắc';
  
  const normalizedCity = city.toLowerCase();
  
  if (northCities.some(c => normalizedCity.includes(c.toLowerCase()))) return 'Bắc';
  if (centralCities.some(c => normalizedCity.includes(c.toLowerCase()))) return 'Trung';
  if (southCities.some(c => normalizedCity.includes(c.toLowerCase()))) return 'Nam';
  if (westCities.some(c => normalizedCity.includes(c.toLowerCase()))) return 'Tây';
  
  // Default to North if no match
  return 'Bắc';
}

// ============= ADMIN ORDER MANAGEMENT FUNCTIONS =============

/**
 * Lấy tất cả đơn hàng cho admin
 * 
 * @param {Object} options - Tùy chọn phân trang và lọc
 * @param {number} options.page - Trang hiện tại (bắt đầu từ 1)
 * @param {number} options.pageSize - Số đơn hàng mỗi trang
 * @param {string} options.status - Lọc theo trạng thái (optional)
 * @param {string} options.searchTerm - Từ khóa tìm kiếm (optional)
 * @param {string} options.sortBy - Sắp xếp theo trường (optional)
 * @param {boolean} options.ascending - Sắp xếp tăng dần hay giảm dần (optional)
 * @returns {Promise<Object>} - Danh sách đơn hàng và tổng số
 */
export async function getAdminOrders({
  page = 1,
  pageSize = 10,
  status = null,
  searchTerm = '',
  sortBy = 'order_date',
  ascending = false
} = {}) {
  try {
    let query = supabase
      .from('orders')
      .select('*', { count: 'exact' });
    
    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }
    
    if (searchTerm) {
      query = query.or(`customer_name.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`);
    }
    
    // Apply sorting
    query = query.order(sortBy, { ascending });
    
    // Apply pagination
    const from = (page - 1) * pageSize;
    query = query.range(from, from + pageSize - 1);
    
    const { data, error, count } = await query;
    
    if (error) {
      console.error('Lỗi khi lấy danh sách đơn hàng:', error.message);
      throw error;
    }
    
    return {
      orders: data || [],
      totalCount: count || 0,
      pageCount: Math.ceil((count || 0) / pageSize)
    };
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đơn hàng:', error.message);
    throw error;
  }
}

/**
 * Lấy chi tiết đơn hàng theo ID
 * 
 * @param {string|number} orderId - ID của đơn hàng
 * @returns {Promise<Object>} - Chi tiết đơn hàng
 */
export async function getOrderById(orderId) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();
    
    if (error) {
      console.error('Lỗi khi lấy chi tiết đơn hàng:', error.message);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết đơn hàng:', error.message);
    throw error;
  }
}

/**
 * Cập nhật trạng thái đơn hàng
 * 
 * @param {string|number} orderId - ID của đơn hàng
 * @param {string} status - Trạng thái mới
 * @param {string} note - Ghi chú khi cập nhật (optional)
 * @returns {Promise<Object>} - Đơn hàng đã cập nhật
 */
export async function updateOrderStatus(orderId, status, note = '') {
  try {
    const updateData = {
      status,
      updated_at: new Date().toISOString()
    };
    
    if (note) {
      updateData.admin_notes = note;
    }
    
    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId)
      .select();
    
    if (error) {
      console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error.message);
      throw error;
    }
    
    return data[0];
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error.message);
    throw error;
  }
}

/**
 * Xóa đơn hàng (soft delete)
 * 
 * @param {string|number} orderId - ID của đơn hàng
 * @returns {Promise<boolean>} - Kết quả xóa
 */
export async function deleteOrder(orderId) {
  try {
    // Soft delete by updating status to 'deleted'
    const { error } = await supabase
      .from('orders')
      .update({
        status: 'deleted',
        deleted_at: new Date().toISOString()
      })
      .eq('id', orderId);
    
    if (error) {
      console.error('Lỗi khi xóa đơn hàng:', error.message);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Lỗi khi xóa đơn hàng:', error.message);
    throw error;
  }
}

/**
 * Lấy thống kê đơn hàng theo trạng thái
 * 
 * @returns {Promise<Object>} - Thống kê đơn hàng theo trạng thái
 */
export async function getOrderStatsByStatus() {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('status');
    
    if (error) {
      console.error('Lỗi khi lấy thống kê đơn hàng:', error.message);
      throw error;
    }
    
    const stats = {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
      total: data.length
    };
    
    data.forEach(order => {
      if (Object.prototype.hasOwnProperty.call(stats, order.status)) {
        stats[order.status]++;
      }
    });
    
    return stats;
  } catch (error) {
    console.error('Lỗi khi lấy thống kê đơn hàng:', error.message);
    throw error;
  }
}

/**
 * Lấy doanh thu theo ngày trong tuần hiện tại
 * 
 * @returns {Promise<Array>} - Doanh thu theo ngày
 */
export async function getCurrentWeekRevenue() {
  try {
    // Lấy ngày đầu tiên của tuần hiện tại (Chủ nhật)
    const today = new Date();
    const firstDay = new Date(today);
    const day = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    firstDay.setDate(today.getDate() - day);
    firstDay.setHours(0, 0, 0, 0);
    
    // Ngày cuối tuần (Thứ 7)
    const lastDay = new Date(firstDay);
    lastDay.setDate(firstDay.getDate() + 6);
    lastDay.setHours(23, 59, 59, 999);
    
    // Query đơn hàng trong tuần này
    const { data, error } = await supabase
      .from('orders')
      .select('order_date, total')
      .gte('order_date', firstDay.toISOString())
      .lte('order_date', lastDay.toISOString());
    
    if (error) {
      console.error('Lỗi khi lấy doanh thu theo ngày:', error.message);
      throw error;
    }
    
    // Khởi tạo mảng doanh thu theo ngày
    const dailyRevenue = Array(7).fill(0);
    const dailyOrders = Array(7).fill(0);
    
    // Tính doanh thu cho mỗi ngày
    data.forEach(order => {
      const orderDate = new Date(order.order_date);
      const dayIndex = orderDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
      
      dailyRevenue[dayIndex] += parseInt(order.total) || 0;
      dailyOrders[dayIndex]++;
    });
    
    // Format kết quả
    const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    return dayNames.map((day, index) => ({
      day,
      orders: dailyOrders[index],
      revenue: dailyRevenue[index]
    }));
  } catch (error) {
    console.error('Lỗi khi lấy doanh thu theo ngày:', error.message);
    throw error;
  }
}

/**
 * Lấy đơn hàng mới nhất
 * 
 * @param {number} limit - Số lượng đơn hàng cần lấy
 * @returns {Promise<Array>} - Danh sách đơn hàng mới nhất
 */
export async function getRecentOrders(limit = 5) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('id, customer_name, order_date, total, status')
      .order('order_date', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Lỗi khi lấy đơn hàng mới nhất:', error.message);
      throw error;
    }
    
    return data.map(order => ({
      id: order.id,
      orderNumber: `ORD-${8700 + parseInt(order.id)}`,
      customerName: order.customer_name,
      value: order.total,
      time: getTimeAgo(new Date(order.order_date)),
      status: order.status
    }));
  } catch (error) {
    console.error('Lỗi khi lấy đơn hàng mới nhất:', error.message);
    throw error;
  }
}

/**
 * Chuyển đổi thời gian thành chuỗi "X giờ/ngày trước"
 * 
 * @param {Date} date - Thời gian cần chuyển đổi
 * @returns {string} - Chuỗi thời gian
 */
function getTimeAgo(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  
  if (diffHours < 24) {
    return `${diffHours} giờ trước`;
  } else {
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} ngày trước`;
  }
}
