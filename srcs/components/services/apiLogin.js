import { supabase } from './supabase';
import bcrypt from 'bcryptjs';

export async function apiLogin({ username, password }) {
  const { data, error } = await supabase
    .from('LoginForm')
    .select('*')
    .eq('username', username)
    .single();

  if (error) {
    console.error('Lỗi khi truy vấn dữ liệu:', error.message);
    throw new Error('Tài khoản không tồn tại');
  }

  const isPasswordValid = await bcrypt.compare(password, data.password);

  if (!isPasswordValid) {
    console.error('Mật khẩu không đúng');
    throw new Error('Mật khẩu không đúng');
  }

  return data;
}
