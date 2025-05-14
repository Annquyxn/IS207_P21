import { supabase } from "./supabase";

export async function registerAddressForm({ addressData }) {
  const { data, error } = await supabase
    .from("addressForm")
    .insert([addressData])
    .select();

  if (error) {
    console.error("Lỗi khi thêm địa chỉ:", error.message);
    throw error;
  }

  return data;
}
