import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  FiSearch,
  FiUser,
  FiUsers,
  FiUserCheck,
  FiUserX,
  FiEdit,
  FiAlertCircle,
} from "react-icons/fi";
import Spinner from "@/components/ui/Spinner";
import { toast } from "react-hot-toast";
import {
  fetchAllUsers,
  updateUserRole,
} from "@/components/features/auth/apiUsers";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
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
        <div className={`p-3 rounded-lg ${color} mr-4`}>{icon}</div>
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
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortOption, setSortOption] = useState("newest");
  const [errorMessage, setErrorMessage] = useState(null);

  const {
    data: users,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        console.log("Fetching users from profiles or mock data...");
        const data = await fetchAllUsers();

        if (data.length === 0) {
          setErrorMessage(
            "Không thể tải dữ liệu người dùng từ cơ sở dữ liệu. Vui lòng kiểm tra kết nối và quyền truy cập."
          );
          return [];
        }

        setErrorMessage(null);
        return data;
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setErrorMessage(
          "Lỗi khi tải dữ liệu người dùng: " +
            (err.message || "Lỗi không xác định")
        );
        return [];
      }
    },
    retry: 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Attempt to directly fetch users if the query returns empty
  const handleRefresh = async () => {
    try {
      toast.loading("Đang tải dữ liệu...");

      // Call the updated fetchAllUsers function that doesn't use admin API
      const userData = await fetchAllUsers();

      toast.dismiss();
      toast.success(`Đã tải ${userData.length} người dùng`);

      // Trigger a refetch to update the UI
      refetch();
    } catch (err) {
      toast.dismiss();
      toast.error(
        "Không thể tải dữ liệu người dùng: " +
          (err.message || "Lỗi không xác định")
      );
      console.error("Error in manual refresh:", err);
      setErrorMessage(
        "Lỗi khi tải dữ liệu người dùng: " +
          (err.message || "Lỗi không xác định")
      );
    }
  };

  // Handle user role update
  const handleRoleUpdate = async (userId, newRole) => {
    try {
      // For toast messages, use Vietnamese names
      const roleName = newRole === "admin" ? "Quản trị viên" : "Người dùng";

      // Update role using the API function
      const success = await updateUserRole(userId, newRole);

      if (!success) throw new Error("Role update failed");

      toast.success(`Vai trò người dùng đã được cập nhật thành ${roleName}`);
      refetch(); // Refresh user data
    } catch (err) {
      console.error("Failed to update user role:", err);
      toast.error("Không thể cập nhật vai trò người dùng");
    }
  };

  // Filter users based on search and role filter
  const filteredUsers =
    users?.filter((user) => {
      const matchesSearch =
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.full_name &&
          user.full_name.toLowerCase().includes(searchTerm.toLowerCase()));

      // More robust role matching - allow for case insensitive comparison
      // and handle potential variations in role naming
      const matchesRole =
        roleFilter === "all" ||
        (roleFilter === "admin" &&
          (user.role === "admin" || user.role === "Quản trị viên")) ||
        (roleFilter === "user" &&
          (user.role === "user" || user.role === "Người dùng"));

      return matchesSearch && matchesRole;
    }) || [];

  // Sort users based on selected sort option
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    switch (sortOption) {
      case "newest":
        return new Date(b.created_at) - new Date(a.created_at);
      case "oldest":
        return new Date(a.created_at) - new Date(b.created_at);
      case "a-z":
        return (a.full_name || a.email).localeCompare(b.full_name || b.email);
      case "z-a":
        return (b.full_name || b.email).localeCompare(a.full_name || a.email);
      default:
        return 0;
    }
  });

  // Calculate user statistics
  const totalUsers = filteredUsers.length;
  const adminCount = filteredUsers.filter(
    (user) => user.role === "admin" || user.role === "Quản trị viên"
  ).length;
  const userCount = filteredUsers.filter(
    (user) => user.role === "user" || user.role === "Người dùng"
  ).length;
  const recentUsers = filteredUsers.filter((user) => {
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
          <h1 className="text-2xl font-bold text-gray-800">
            Quản lý người dùng
          </h1>
          <p className="text-gray-600 mt-1">
            Quản lý tất cả người dùng trong hệ thống
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition font-medium shadow-sm flex items-center gap-2"
          onClick={handleRefresh}
        >
          <FiUserCheck className="w-4 h-4" />
          Làm mới danh sách
        </motion.button>
      </div>

      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 border-l-4 border-yellow-400 p-4"
        >
          <div className="flex">
            <FiAlertCircle className="h-6 w-6 text-yellow-400 mr-3" />
            <div>
              <p className="text-sm text-yellow-700">{errorMessage}</p>
            </div>
          </div>
        </motion.div>
      )}

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
            <FiSearch className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">Tất cả vai trò</option>
              <option value="admin">Quản trị viên</option>
              <option value="user">Người dùng thường</option>
            </select>
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
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
              {sortedUsers.length > 0 ? (
                sortedUsers.map((user) => (
                  <motion.tr
                    key={user.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ backgroundColor: "#f9fafb" }}
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
                          {user.phone && (
                            <div className="text-xs text-gray-500">
                              {user.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                      <div className="text-xs text-gray-500">
                        {user.last_sign_in
                          ? `Đăng nhập gần nhất: ${new Date(
                              user.last_sign_in
                            ).toLocaleDateString("vi-VN")}`
                          : "Chưa đăng nhập"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        className={`px-2.5 py-1 text-xs leading-5 rounded-full border-0 ${
                          user.role === "admin" || user.role === "Quản trị viên"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-green-100 text-green-800"
                        }`}
                        value={
                          user.role === "Quản trị viên"
                            ? "admin"
                            : user.role === "Người dùng"
                            ? "user"
                            : user.role
                        }
                        onChange={(e) =>
                          handleRoleUpdate(user.id, e.target.value)
                        }
                      >
                        <option value="user">Người dùng</option>
                        <option value="admin">Quản trị viên</option>
                      </select>
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
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    {errorMessage
                      ? "Không thể tải dữ liệu người dùng"
                      : "Không tìm thấy người dùng nào"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Hiển thị {sortedUsers.length} người dùng
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserManager;
