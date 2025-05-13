import { supabase } from "./supabase";

export async function apiLogin({ username, password }) {
  const { data, error } = await supabase
    .from("LoginForm")
    .select("*")
    .eq("username", username)
    .eq("password", password)
    .single();

  if (error) {
    console.error("Lỗi khi đăng nhập:", error.message);
    throw new Error("Tài khoản hoặc mật khẩu không đúng");
  }

  return data;
}
