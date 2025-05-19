import { supabase } from './supabase';

export async function getProduct() {
  let { data: product, error } = await supabase.from('product').select('*');

  if (error) {
    console.error(error);
    throw new Error('Không tìm thấy dữ liệu');
  }

  return product;
}

export async function createProduct(newProduct) {
  const { data, error } = await supabase
    .from('product')
    .insert([newProduct])
    .select();

  if (error) {
    console.error(error);
    throw new Error('Không thể thêm sản phẩm');
  }

  return data;
}

export async function deleteProduct(id) {
  const { data, error } = await supabase.from('product').delete().eq('id', id);

  if (error) {
    console.error(error);
    throw new Error('Không thể xoá sản phẩm');
  }

  return data;
}

export async function countProduct() {
  const { count, error } = await supabase
    .from('product')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Lỗi đếm sản phẩm:', error.message);
    return 0;
  }

  return count || 0;
}
