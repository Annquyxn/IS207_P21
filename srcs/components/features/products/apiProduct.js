import { supabase } from '@/components/services/supabase';

function formatCurrency(value) {
  if (!value) return '0₫';
  return `${Number(value).toLocaleString('vi-VN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}₫`;
}

// Analytics API functions - Using only the orders table
export async function getRevenueByMonth(year = 2023) {
  const { data, error } = await supabase
    .from('orders')
    .select('created_at, total_amount')
    .gte('created_at', `${year}-01-01`)
    .lte('created_at', `${year}-12-31`);

  if (error) {
    console.error('Error fetching revenue by month:', error);
    return Array(12).fill(0);
  }

  // Group by month and sum total_amount
  const monthlyRevenue = Array(12).fill(0);
  data.forEach(order => {
    const date = new Date(order.created_at);
    const month = date.getMonth(); // 0-11
    monthlyRevenue[month] += order.total_amount || 0;
  });

  return monthlyRevenue;
}

export async function getProfitByMonth(year = 2023) {
  // Get revenue first
  const revenue = await getRevenueByMonth(year);
  
  // Calculate profit as approximately 30% of revenue
  return revenue.map(amount => Math.round(amount * 0.3));
}

export async function getTopProductPerformance(limit = 10) {
  // Get order items with product details and count/sum by product
  const { data, error } = await supabase
    .from('order_items')
    .select(`
      product_id,
      quantity,
      price,
      products:product_id (name, category)
    `);

  if (error) {
    console.error('Error fetching order items:', error);
    return [];
  }

  // Group by product and calculate sales
  const productSales = {};
  
  data.forEach(item => {
    const productId = item.product_id;
    const productName = item.products?.name || 'Unknown Product';
    const category = item.products?.category || 'Uncategorized';
    const sales = (item.price || 0) * (item.quantity || 1);
    
    if (!productSales[productId]) {
      productSales[productId] = {
        name: productName,
        category,
        sales: 0
      };
    }
    
    productSales[productId].sales += sales;
  });
  
  // Convert to array and sort by sales
  const topProducts = Object.values(productSales)
    .sort((a, b) => b.sales - a.sales)
    .slice(0, limit);
  
  return topProducts.length > 0 ? topProducts : [
    { name: 'Laptop Asus ROG Strix G15', sales: 1250000000, category: 'Laptop' },
    { name: 'Laptop MSI Raider GE76', sales: 980000000, category: 'Laptop' },
    { name: 'Laptop Dell XPS 15', sales: 850000000, category: 'Laptop' }
  ];
}

export async function getRegionalDistribution() {
  // Get shipping addresses from orders and group by region
  const { data, error } = await supabase
    .from('orders')
    .select('shipping_address, total_amount');

  if (error) {
    console.error('Error fetching orders for regional data:', error);
    return [
      { name: 'Miền Nam', value: 33 },
      { name: 'Miền Bắc', value: 33 },
      { name: 'Miền Trung', value: 34 }
    ];
  }

  // Simple region classifier based on address text
  const regions = {
    'Miền Nam': 0,
    'Miền Bắc': 0,
    'Miền Trung': 0
  };
  
  const southKeywords = ['hồ chí minh', 'tphcm', 'hcm', 'sài gòn', 'bình dương', 'đồng nai', 'vũng tàu', 'cần thơ', 'mekong'];
  const northKeywords = ['hà nội', 'hanoi', 'hải phòng', 'quảng ninh', 'nam định', 'bắc ninh', 'hà nam', 'ninh bình'];
  const centralKeywords = ['đà nẵng', 'huế', 'quảng nam', 'nha trang', 'khánh hòa', 'bình định', 'phú yên', 'nghệ an', 'hà tĩnh'];
  
  data.forEach(order => {
    const address = (order.shipping_address || '').toLowerCase();
    const amount = order.total_amount || 0;
    
    if (southKeywords.some(keyword => address.includes(keyword))) {
      regions['Miền Nam'] += amount;
    } else if (northKeywords.some(keyword => address.includes(keyword))) {
      regions['Miền Bắc'] += amount;
    } else if (centralKeywords.some(keyword => address.includes(keyword))) {
      regions['Miền Trung'] += amount;
    } else {
      // Default to evenly distributed if can't determine
      regions['Miền Nam'] += amount / 3;
      regions['Miền Bắc'] += amount / 3;
      regions['Miền Trung'] += amount / 3;
    }
  });
  
  // Convert to percentage
  const total = Object.values(regions).reduce((sum, val) => sum + val, 0);
  
  return Object.entries(regions).map(([name, value]) => ({
    name,
    value: total ? Math.round((value / total) * 100) : 33
  }));
}

export async function getTotalRevenue() {
  const { data, error } = await supabase
    .from('orders')
    .select('total_amount');

  if (error) {
    console.error('Error fetching orders for total revenue:', error);
    return 0;
  }

  // Sum all order amounts
  return data.reduce((sum, order) => sum + (order.total_amount || 0), 0);
}

export async function getOrderCount() {
  const { count, error } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Error fetching order count:', error);
    return 0;
  }

  return count || 0;
}

export async function getOrderStatsByStatus() {
  const { data, error } = await supabase
    .from('orders')
    .select('status');

  if (error) {
    console.error('Error fetching orders for status stats:', error);
    return [];
  }

  // Count orders by status
  const statusCounts = {};
  const statusNames = {
    'completed': 'Hoàn thành',
    'processing': 'Đang xử lý',
    'shipping': 'Đang giao hàng',
    'cancelled': 'Đã hủy',
    'pending': 'Chờ xác nhận'
  };
  
  data.forEach(order => {
    const status = order.status || 'pending';
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });
  
  // Convert to percentage
  const total = Object.values(statusCounts).reduce((sum, count) => sum + count, 0);
  
  return Object.entries(statusCounts).map(([status, count]) => ({
    name: statusNames[status] || status,
    value: total ? Math.round((count / total) * 100) : 0
  })).sort((a, b) => b.value - a.value);
}

export async function getRevenueByRecentDays(days = 7) {
  // Get current date and date from 'days' ago
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days + 1);
  
  // Format dates for Supabase query
  const startStr = startDate.toISOString().split('T')[0];
  const endStr = endDate.toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('orders')
    .select('created_at, total_amount')
    .gte('created_at', startStr)
    .lte('created_at', endStr);

  if (error) {
    console.error('Error fetching recent orders:', error);
    return [];
  }

  // Group by date
  const dailyRevenue = {};
  
  // Initialize all days in the range
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    dailyRevenue[dateStr] = 0;
  }
  
  // Sum revenue by date
  data.forEach(order => {
    const dateStr = new Date(order.created_at).toISOString().split('T')[0];
    dailyRevenue[dateStr] = (dailyRevenue[dateStr] || 0) + (order.total_amount || 0);
  });
  
  // Convert to array format
  return Object.entries(dailyRevenue).map(([date, revenue]) => ({
    date: new Date(date).toLocaleDateString('vi-VN'),
    revenue
  }));
}

export async function fetchProducts(category = 'laptop') {
  let tableName = 'laptop';

  if (category === 'ssd') {
    tableName = 'ssd';
  } else if (category === 'keyboard') {
    tableName = 'keyboards';
  } else if (category === 'headphone') {
    tableName = 'headphone';
  } else if (category === 'pccooling') {
    tableName = 'pccooling';
  } else if (category === 'mouse') {
    tableName = 'mouse';
  } else if (category === 'pcgaming') {
    tableName = 'pcgaming';
  } else if (category === 'laptop') {
    tableName = 'laptop';
  } else if (category === 'laptop-do-hoa') {
    tableName = 'laptop_do_hoa';
  } else if (category === 'laptop-doanh-nhan') {
    tableName = 'laptop_doanh_nhan';
  } else if (category === 'laptop-gaming') {
    tableName = 'laptop_gaming';
  } else if (category === 'laptop-van-phong') {
    tableName = 'laptop_van_phong';
  } else if (category === 'laptop-asus-oled') {
    tableName = 'laptop_asus_oled';
  } else if (category === 'laptop-asus-vivobook') {
    tableName = 'laptop_asus_vivobook';
  } else if (category === 'laptop-asus-zenbook') {
    tableName = 'laptop_asus_zenbook';
  } else if (category === 'laptop-asus-tuf') {
    tableName = 'laptop_tuf_gaming';
  } else if (category === 'laptop-rog-strix') {
    tableName = 'laptop_rog_strix';
  } else if (category === 'laptop-rog-zephyrus') {
    tableName = 'laptop_rog_zephyrus';
  } else if (category === 'laptop-acer-aspire') {
    tableName = 'laptop_acer_aspire';
  } else if (category === 'laptop-acer-swift') {
    tableName = 'laptop_acer_swift';
  } else if (category === 'laptop-acer-predator-helios') {
    tableName = 'laptop_acer_predator_helios';
  } else if (category === 'laptop-acer-nitro') {
    tableName = 'laptop_acer_nitro';
  } else if (category === 'laptop-msi-cyborg') {
    tableName = 'laptop_msi_cyborg';
  } else if (category === 'laptop-msi-katana') {
    tableName = 'laptop_msi_katana';
  } else if (category === 'laptop-msi-modern') {
    tableName = 'laptop_msi_modern';
  } else if (category === 'laptop-msi-prestige') {
    tableName = 'laptop_msi_prestige';
  } else if (category === 'laptop-msi-raider') {
    tableName = 'laptop_msi_raider';
  } else if (category === 'laptop-lenovo-ideapad') {
    tableName = 'laptop_lenovo_ideapad';
  } else if (category === 'laptop-lenovo-legion') {
    tableName = 'laptop_lenovo_legion';
  } else if (category === 'laptop-lenovo-thinkbook') {
    tableName = 'laptop_lenovo_thinkbook';
  } else if (category === 'laptop-lenovo-thinkpad') {
    tableName = 'laptop_lenovo_thinkpad';
  } else if (category === 'laptop-lenovo-yoga') {
    tableName = 'laptop_lenovo_yoga';
  } else if (category === 'laptop-dell-alienware') {
    tableName = 'laptop_dell_alienware';
  } else if (category === 'laptop-dell-g15') {
    tableName = 'laptop_dell_g15';
  } else if (category === 'laptop-dell-inspiron') {
    tableName = 'laptop_dell_inspiron';
  } else if (category === 'laptop-dell-xps') {
    tableName = 'laptop_dell_xps';
  } else if (category === 'laptop-dell-latitude') {
    tableName = 'laptop_dell_latitude';
  } else if (category === 'laptop-dell-vostro') {
    tableName = 'laptop_dell_vostro';
  } else if (category === 'laptop-hp-omen') {
    tableName = 'laptop_hp_omen';
  } else if (category === 'laptop-hp-victus') {
    tableName = 'laptop_hp_victus';
  } else if (category === 'laptop-chay-ai') {
    tableName = 'laptop_chay_ai';
  } else if (category === 'laptop-duoi-15-trieu') {
    tableName = 'laptop_duoi_15tr';
  } else if (category === 'laptop-tren-20-trieu') {
    tableName = 'laptop_tren_20tr';
  } else if (category === 'laptop-tu-15-den-20-trieu') {
    tableName = 'laptop_tu_15_den_20_trieu';
  } else if (category === 'cpu-intel-i3') {
    tableName = 'cpu_intel_i3';
  } else if (category === 'cpu-intel-i5') {
    tableName = 'cpu_intel_i5';
  } else if (category === 'cpu-intel-i7') {
    tableName = 'cpu_intel_i7';
  } else if (category === 'cpu-intel-i9') {
    tableName = 'cpu_intel_i9';
  } else if (category === 'cpu-amd-r3') {
    tableName = 'cpu_amd_r3';
  } else if (category === 'cpu-amd-r5') {
    tableName = 'cpu_amd_r5';
  } else if (category === 'cpu-amd-r7') {
    tableName = 'cpu_amd_r7';
  } else if (category === 'cpu-amd-r9') {
    tableName = 'cpu_amd_r9';
  }

  const { data, error } = await supabase.from(tableName).select('*');

  if (error) {
    console.error(`Error fetching ${tableName}:`, error.message);
    return [];
  }

  return data.map((item) => {
    const title = item.title?.replace(/-/g, ' ') || 'No Title';
    const brand = item.brand || 'Unknown';
    const salePrice = item.sale_price || 0;
    const originalPrice = item.original_price || Math.round(salePrice * 1.2);

    const discount =
      originalPrice && salePrice
        ? `${Math.round(((originalPrice - salePrice) / originalPrice) * 100)}%`
        : '0%';

    return {
      id: item.id || '',
      title,
      brand,
      image: item.image || '',
      salePrice: formatCurrency(salePrice),
      originalPrice: formatCurrency(originalPrice),
      discount,
      rating: item.rating || 0,
      reviewCount: item.review_count || 0,
      thumbnail: item.thumbnails || '',
      description: item.description || '',
      detailImage: item.detail_image || '',
      performance: item.performance || '',
      extends: item.extends || '',
      category: tableName,
    };
  });
}

// Get current logged in user ID
export async function getUserId() {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error('Error fetching user:', error.message);
      return null;
    }

    return user?.id || null;
  } catch (error) {
    console.error('Error in getUserId:', error);
    return null;
  }
}
