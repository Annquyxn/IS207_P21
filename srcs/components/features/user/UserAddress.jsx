import { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaPlus, FaPencilAlt, FaTrash, FaHome, FaBriefcase } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { supabase } from '@/components/services/supabase';
import { useUser } from './UserContext';
import Spinner from '@/components/ui/Spinner';

function UserAddress() {
  const { userInfo, getUserId } = useUser();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    recipient: '',
    phone: '',
    address: '',
    ward: '',
    district: '',
    city: '',
    isDefault: false,
    type: 'home'
  });

  // Fetch addresses on component mount
  useEffect(() => {
    async function fetchAddresses() {
      try {
        const userId = await getUserId();
        if (!userId) {
          console.error('User not logged in');
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('addresses')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        // If no addresses found, use mock data for demonstration
        if (!data || data.length === 0) {
          // Use userInfo for mock data if available
          const defaultName = userInfo?.fullName || 'Nguyễn Văn A';
          const defaultPhone = userInfo?.phone || '0901234567';
          
          setAddresses([
            {
              id: 1,
              name: 'Nhà',
              recipient: defaultName,
              phone: defaultPhone,
              address: '123 Đường Lê Lợi',
              ward: 'Phường Bến Nghé',
              district: 'Quận 1',
              city: 'TP. Hồ Chí Minh',
              isDefault: true,
              type: 'home',
              user_id: userId
            }
          ]);
        } else {
          setAddresses(data);
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAddresses();
  }, [userInfo, getUserId]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const userId = await getUserId();
      if (!userId) {
        console.error('User not logged in');
        return;
      }
      
      if (editingId) {
        // Update existing address in Supabase
        const { error } = await supabase
          .from('addresses')
          .update({
            ...formData,
            user_id: userId,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingId);
          
        if (error) throw error;
        
        // Update state
        setAddresses(prev => prev.map(addr => 
          addr.id === editingId ? { ...formData, id: editingId, user_id: userId } : addr
        ));
      } else {
        // Add new address to Supabase
        const { data, error } = await supabase
          .from('addresses')
          .insert({
            ...formData,
            user_id: userId,
            created_at: new Date().toISOString()
          })
          .select();
          
        if (error) throw error;
        
        // Update state with new address from server
        if (data && data[0]) {
          setAddresses(prev => [...prev, data[0]]);
        } else {
          // Fallback if no data returned
          const newAddress = {
            ...formData,
            id: Date.now(),
            user_id: userId
          };
          setAddresses(prev => [...prev, newAddress]);
        }
      }
      
      // Reset form
      setFormData({
        name: '',
        recipient: '',
        phone: '',
        address: '',
        ward: '',
        district: '',
        city: '',
        isDefault: false,
        type: 'home'
      });
      setEditingId(null);
      setShowAddForm(false);
    } catch (error) {
      console.error('Error saving address:', error);
      alert('Có lỗi xảy ra khi lưu địa chỉ. Vui lòng thử lại sau.');
    }
  };

  const handleEdit = (address) => {
    setFormData({ ...address });
    setEditingId(address.id);
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Update state
      setAddresses(prev => prev.filter(addr => addr.id !== id));
    } catch (error) {
      console.error('Error deleting address:', error);
      alert('Có lỗi xảy ra khi xóa địa chỉ. Vui lòng thử lại sau.');
    }
  };

  const handleSetDefault = async (id) => {
    try {
      const userId = await getUserId();
      if (!userId) {
        console.error('User not logged in');
        return;
      }
      
      // Update all addresses to non-default first
      await supabase
        .from('addresses')
        .update({ isDefault: false })
        .eq('user_id', userId);
        
      // Set selected address as default
      await supabase
        .from('addresses')
        .update({ isDefault: true })
        .eq('id', id);
      
      // Update state
      setAddresses(prev => prev.map(addr => ({
        ...addr,
        isDefault: addr.id === id
      })));
    } catch (error) {
      console.error('Error setting default address:', error);
      alert('Có lỗi xảy ra khi đặt địa chỉ mặc định. Vui lòng thử lại sau.');
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 px-8 py-6 text-white">
        <h2 className="text-2xl font-bold flex items-center">
          <FaMapMarkerAlt className="mr-3" /> Địa chỉ của tôi
        </h2>
        <p className="text-red-100 mt-1">Quản lý địa chỉ giao hàng của bạn</p>
      </div>

      <div className="p-8">
        {/* Address list */}
        <div className="space-y-5 mb-8">
          {addresses.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-red-50 rounded-full mx-auto flex items-center justify-center mb-4">
                <FaMapMarkerAlt className="text-red-400 text-2xl" />
              </div>
              <p className="text-gray-500">Bạn chưa có địa chỉ nào</p>
            </div>
          ) : (
            addresses.map((address) => (
              <motion.div
                key={address.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                transition={{ duration: 0.3 }}
                className={`border rounded-xl p-5 relative ${
                  address.isDefault 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-200'
                }`}
              >
                {address.isDefault && (
                  <span className="absolute top-5 right-5 text-xs bg-red-600 text-white px-2 py-1 rounded-full">
                    Mặc định
                  </span>
                )}
                
                <div className="flex items-center mb-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                    address.type === 'home' 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-amber-100 text-amber-600'
                  }`}>
                    {address.type === 'home' ? <FaHome className="text-lg" /> : <FaBriefcase className="text-lg" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{address.name}</h3>
                    <p className="text-sm text-gray-500">{address.recipient} | {address.phone}</p>
                  </div>
                </div>
                
                <div className="ml-1 text-gray-600">
                  <p>{address.address}</p>
                  <p>{address.ward}, {address.district}, {address.city}</p>
                </div>
                
                <div className="mt-4 flex justify-end gap-2">
                  {!address.isDefault && (
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSetDefault(address.id)}
                      className="px-3 py-1.5 bg-white border border-red-500 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
                    >
                      Đặt mặc định
                    </motion.button>
                  )}
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleEdit(address)}
                    className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <FaPencilAlt />
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(address.id)}
                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <FaTrash />
                  </motion.button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Add address button */}
        {!showAddForm ? (
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddForm(true)}
            className="flex items-center justify-center w-full py-3 border-2 border-dashed border-red-300 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
          >
            <FaPlus className="mr-2" /> Thêm địa chỉ mới
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-red-200 rounded-xl p-6 mt-6"
          >
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              {editingId ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ mới'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên địa chỉ</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="VD: Nhà, Công ty..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
                
                {/* Type field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Loại địa chỉ</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="home">Nhà riêng</option>
                    <option value="work">Công ty</option>
                  </select>
                </div>
                
                {/* Recipient field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Người nhận</label>
                  <input
                    type="text"
                    name="recipient"
                    value={formData.recipient}
                    onChange={handleChange}
                    placeholder="Tên người nhận"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
                
                {/* Phone field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Số điện thoại"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              {/* Address field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Số nhà, tên đường"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Ward field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phường/Xã</label>
                  <input
                    type="text"
                    name="ward"
                    value={formData.ward}
                    onChange={handleChange}
                    placeholder="Phường/Xã"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
                
                {/* District field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quận/Huyện</label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    placeholder="Quận/Huyện"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
                
                {/* City field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tỉnh/Thành phố</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Tỉnh/Thành phố"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              {/* Default checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isDefault"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleChange}
                  className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <label htmlFor="isDefault" className="ml-2 text-sm text-gray-700">
                  Đặt làm địa chỉ mặc định
                </label>
              </div>
              
              {/* Form buttons */}
              <div className="flex gap-3 justify-end pt-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingId(null);
                    setFormData({
                      name: '',
                      recipient: '',
                      phone: '',
                      address: '',
                      ward: '',
                      district: '',
                      city: '',
                      isDefault: false,
                      type: 'home'
                    });
                  }}
                  className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg shadow-sm hover:shadow transition-all"
                >
                  {editingId ? 'Cập nhật' : 'Lưu'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default UserAddress;
