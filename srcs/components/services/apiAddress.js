import { supabase } from "./supabase";

export async function registerAddressForm({ addressData }) {
  // Get full address names before saving
  try {
    let provinceName = "", districtName = "", wardName = "";
    
    // Ưu tiên sử dụng tên đã được cung cấp từ client
    if (addressData.cityName && addressData.districtName && addressData.wardName) {
      provinceName = addressData.cityName;
      districtName = addressData.districtName;
      wardName = addressData.wardName;
    } else {
      // Xử lý trường hợp chỉ có mã mà không có tên
      try {
        const { data: provinceData } = await supabase
          .from("provinces")
          .select("name, full_name")
          .eq("code", addressData.city)
          .single();
        
        provinceName = provinceData?.full_name || provinceData?.name || addressData.city;
      } catch (err) {
        console.error("Lỗi khi lấy tên tỉnh/thành phố:", err.message);
      }
      
      try {
        const { data: districtData } = await supabase
          .from("districts")
          .select("name, full_name")
          .eq("code", addressData.district)
          .single();
        
        districtName = districtData?.full_name || districtData?.name || addressData.district;
      } catch (err) {
        console.error("Lỗi khi lấy tên quận/huyện:", err.message);
      }
      
      try {
        const { data: wardData } = await supabase
          .from("wards")
          .select("name, full_name")
          .eq("code", addressData.ward)
          .single();
        
        wardName = wardData?.full_name || wardData?.name || addressData.ward;
      } catch (err) {
        console.error("Lỗi khi lấy tên phường/xã:", err.message);
      }
    }
    
    // Ưu tiên sử dụng fullAddress nếu đã được cung cấp
    const fullAddress = addressData.fullAddress || 
      `${addressData.street}, ${wardName}, ${districtName}, ${provinceName}`;
    
    // Format the address with full names
    const formattedAddress = {
      ...addressData,
      cityName: provinceName,
      districtName: districtName,
      wardName: wardName,
      fullAddress: fullAddress
    };

    // Save to addressForm table
    const { data, error } = await supabase
      .from("addressForm")
      .insert([formattedAddress])
      .select();

    if (error) {
      console.error("Lỗi khi thêm địa chỉ:", error.message);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Lỗi khi xử lý địa chỉ:", error.message);
    throw error;
  }
}
