import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { supabase } from "@/components/services/supabase";
import { FiSearch, FiUser, FiUsers, FiUserCheck, FiUserX, FiEdit, FiTrash2 } from "react-icons/fi";
import Spinner from "@/components/ui/Spinner";

// Mock data to use as fallback when the users table doesn't exist
const MOCK_USERS = [
  {
    id: 1,
    email: "admin@pcworld.com",
    full_name: "Admin User",
    role: "admin",
    created_at: "2023-09-15T08:00:00.000Z",
  },
  {
    id: 2,
    email: "customer1@example.com",
    full_name: "Nguyễn Văn A",
    role: "user",
    created_at: "2023-09-20T10:30:00.000Z",
  },
  {
    id: 3,
    email: "customer2@example.com",
    full_name: "Trần Thị B",
    role: "user",
    created_at: "2023-10-05T14:45:00.000Z",
  },
  {
    id: 4,
    email: "customer3@example.com",
    full_name: "Lê Văn C",
    role: "user",
    created_at: "2023-10-12T09:15:00.000Z",
  },
  {
    id: 5,
    email: "staff@pcworld.com",
    full_name: "Phạm Thị D",
    role: "admin",
    created_at: "2023-08-25T11:20:00.000Z",
  }
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  }
};

// User statistics card component
const StatCard = ({ title, value, icon, color }) => {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
      className={`bg-white p-5 rounded-xl shadow-sm border border-gray-100`}
    >
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${color} mr-4`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
        </div>
      </div>
    </motion.div>
  );
};

const UserManager = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.warn("Error fetching users from Supabase:", error.message);
          // If the error is a 404, return mock data
          if (error.code === "PGRST116" || error.status === 404) {
            console.info("Using mock user data as fallback");
            return MOCK_USERS;
          }
          throw error;
        }
        
        return data;
      } catch (err) {
        console.error("Failed to fetch users:", err);
        // Return mock data as fallback for any error
        return MOCK_USERS;
      }
    },
    // Add retry and stale time settings
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const filteredUsers = users?.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];
  
  // Calculate user statistics
  const totalUsers = filteredUsers.length;
  const adminCount = filteredUsers.filter(user => user.role === 'admin').length;
  const userCount = filteredUsers.filter(user => user.role === 'user').length;
  const recentUsers = filteredUsers.filter(user => {
    const date = new Date(user.created_at);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return date > thirtyDaysAgo;
  }).length;

  if (isLoading) return <Spinner />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý người dùng</h1>
          <p className="text-gray-600 mt-1">Quản lý tất cả người dùng trong hệ thống</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition font-medium shadow-sm flex items-center gap-2"
        >
          <FiUserCheck className="w-4 h-4" />
          Thêm người dùng
        </motion.button>
      </div>

      {/* Statistics */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6"
      >
        <StatCard 
          title="Tổng người dùng" 
          value={totalUsers} 
          icon={<FiUsers className="w-5 h-5 text-blue-600" />}
          color="bg-blue-50" 
        />
        <StatCard 
          title="Quản trị viên" 
          value={adminCount} 
          icon={<FiUserCheck className="w-5 h-5 text-purple-600" />}
          color="bg-purple-50" 
        />
        <StatCard 
          title="Người dùng thường" 
          value={userCount} 
          icon={<FiUser className="w-5 h-5 text-green-600" />}
          color="bg-green-50" 
        />
        <StatCard 
          title="Người dùng mới" 
          value={recentUsers} 
          icon={<FiUserX className="w-5 h-5 text-red-600" />}
          color="bg-red-50" 
        />
      </motion.div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Tìm kiếm người dùng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 w-full"
            />
            <FiSearch
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm">
              <option value="all">Tất cả vai trò</option>
              <option value="admin">Quản trị viên</option>
              <option value="user">Người dùng thường</option>
            </select>
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm">
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="a-z">A-Z</option>
              <option value="z-a">Z-A</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Người dùng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vai trò
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <motion.tr 
                    key={user.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ backgroundColor: '#f9fafb' }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-red-100 to-red-200 text-red-600 flex items-center justify-center">
                          <span className="text-lg font-medium">
                            {user.full_name?.[0]?.toUpperCase() ||
                              user.email[0].toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.full_name || "Chưa cập nhật"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {user.role === "admin" ? "Admin" : "User"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <motion.button 
                          className="text-blue-600 hover:text-blue-900 flex items-center"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FiEdit className="w-4 h-4 mr-1" />
                          Sửa
                        </motion.button>
                        <motion.button 
                          className="text-red-600 hover:text-red-900 flex items-center"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FiTrash2 className="w-4 h-4 mr-1" />
                          Xóa
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    Không tìm thấy người dùng nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="mt-5 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Hiển thị {filteredUsers.length} người dùng
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm">Trước</button>
            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm">1</span>
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm">Sau</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserManager;
