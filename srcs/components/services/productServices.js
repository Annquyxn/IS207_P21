import { supabase } from './supabase'

// 🔁 Lấy sản phẩm từ Supabase
export async function fetchProducts() {
  const { data, error } = await supabase.from('products').select('*')
  if (error) {
    console.error('Error fetching products:', error.message)
    return []
  }
  return data
}

// 🔁 Gửi đơn hàng đến Supabase (ví dụ chèn vào bảng `orders`)
export async function placeOrder(orderData) {
  const { data, error } = await supabase.from('orders').insert([orderData])
  if (error) {
    console.error('Error placing order:', error.message)
    return null
  }
  return data
}
