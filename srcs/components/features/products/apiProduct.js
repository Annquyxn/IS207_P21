import { supabase } from '@/components/services/supabase';

function formatCurrency(value) {
  if (!value) return '0₫';
  return `${Number(value).toLocaleString('vi-VN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}₫`;
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
