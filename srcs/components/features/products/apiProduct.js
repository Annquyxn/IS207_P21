import { supabase } from '@/components/services/supabase'

function formatCurrency(value) {
  if (!value) return '0₫'
  return `${Number(value).toLocaleString('vi-VN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}₫`
}

export async function fetchProducts(category = 'keyboard') {
  let tableName = 'keyboards';
  
  if (category === 'ssd') {
    tableName = 'ssd';
  } else if (category === 'keyboard') {
    tableName = 'keyboards';
  } else if (category === 'headphone') {
    tableName = 'headphone';
  }
  
  const { data, error } = await supabase.from(tableName).select('*')
  
  if (error) {
    console.error(`Error fetching ${tableName}:`, error.message)
    return []
  }

  return data.map(item => {
    const title = item.title?.replace(/-/g, ' ') || 'No Title'
    const brand = item.brand || 'Unknown'
    const salePrice = item.sale_price || 0
    const originalPrice = item.original_price || Math.round(salePrice * 1.2)

    const discount =
      originalPrice && salePrice
        ? `${Math.round(((originalPrice - salePrice) / originalPrice) * 100)}%`
        : '0%'

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
    }
  })
}
