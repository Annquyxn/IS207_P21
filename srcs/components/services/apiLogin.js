import { supabase } from "./supabase";

function isValidEmail(email) {
  // Đơn giản, chỉ kiểm tra có ký tự @ và dấu chấm
  return typeof email === "string" && /.+@.+\..+/.test(email);
}

export async function apiLogin({ username, password }) {
  if (!username || !password) {
    throw new Error("Vui lòng nhập đầy đủ email và mật khẩu");
  }
  if (!isValidEmail(username)) {
    throw new Error("Email không hợp lệ");
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: username,
    password: password,
  });

  if (error) {
    // Customize error message for invalid credentials
    let customMessage = error.message;
    if (
      error.message === "Invalid login credentials" ||
      error.message === "Invalid login credentials provided" ||
      error.message.includes("Invalid login credentials")
    ) {
      customMessage = "Sai mật khẩu hoặc email chưa đăng ký";
    }
    throw new Error(customMessage);
  }

  return {
    user: data.user,
    session: data.session,
    message: "Đăng nhập thành công",
  };
}
