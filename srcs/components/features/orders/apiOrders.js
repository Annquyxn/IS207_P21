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
