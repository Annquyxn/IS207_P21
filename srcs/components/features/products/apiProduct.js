import { supabase } from '@/components/services/supabase'

export async function fetchProducts() {
  const { data, error } = await supabase.from('keyboards').select('*')
  if (error) {
    console.error('Error fetching products:', error.message)
    return []
  }
  
  console.log('Data from Supabase:', data)
  
  return data.map(item => {
    const brandMatch = item.handle?.split('-')[0] || 'unknown';
    
    const formattedPrice = item.price ? `${item.price.toLocaleString('vi-VN')}₫` : '0₫';
    
    const originalPrice = Math.round(item.price * 1.2);
    const formattedOriginalPrice = `${originalPrice.toLocaleString('vi-VN')}₫`;
    const discountPercent = '17%';
    
    return {
      id: item.id || '',
      title: item.handle?.replace(/-/g, ' ') || '',
      image: item.image_url || '',
      link: item.link || '',
      salePrice: formattedPrice,
      originalPrice: formattedOriginalPrice,
      discount: discountPercent,
      rating: 4.5,
      reviewCount: Math.floor(Math.random() * 100) + 10,
      brand: brandMatch
    };
  });
}