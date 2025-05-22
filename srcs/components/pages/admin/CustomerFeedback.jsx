import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiFilter, FiMessageSquare, FiUser, FiCalendar, FiStar, FiTrash2, FiMail, FiTag } from 'react-icons/fi';

// Mock feedback data
const feedbackData = [
  {
    id: 1,
    customer: 'Nguyễn Văn A',
    email: 'nguyenvana@gmail.com',
    rating: 5,
    message: 'Sản phẩm chất lượng, giao hàng nhanh. Rất hài lòng với dịch vụ của shop.',
    date: '2023-11-15',
    product: 'Dell XPS 13',
    status: 'Chưa phản hồi',
    type: 'Đánh giá sản phẩm'
  },
  {
    id: 2,
    customer: 'Trần Thị B',
    email: 'tranthib@gmail.com',
    rating: 2,
    message: 'Giao hàng quá chậm, đóng gói cẩu thả. Sản phẩm không đúng như mô tả trên web.',
    date: '2023-11-10',
    product: 'Logitech G502',
    status: 'Đã phản hồi',
    type: 'Khiếu nại'
  },
  {
    id: 3,
    customer: 'Lê Văn C',
    email: 'levanc@gmail.com',
    rating: 4,
    message: 'Sản phẩm tốt nhưng giá hơi cao. Nhân viên tư vấn nhiệt tình.',
    date: '2023-11-08',
    product: 'Samsung Odyssey G7',
    status: 'Chưa phản hồi',
    type: 'Đánh giá sản phẩm'
  },
  {
    id: 4,
    customer: 'Phạm Thị D',
    email: 'phamthid@gmail.com',
    rating: 3,
    message: 'Sản phẩm ổn nhưng không có hướng dẫn sử dụng bằng tiếng Việt.',
    date: '2023-11-05',
    product: 'Corsair K95 RGB',
    status: 'Đã phản hồi',
    type: 'Góp ý'
  },
  {
    id: 5,
    customer: 'Hoàng Văn E',
    email: 'hoangvane@gmail.com',
    rating: 1,
    message: 'Sản phẩm bị lỗi sau 1 tuần sử dụng. Liên hệ bảo hành rất khó khăn.',
    date: '2023-11-01',
    product: 'ASUS ROG Strix G15',
    status: 'Đã phản hồi',
    type: 'Khiếu nại'
  },
  {
    id: 6,
    customer: 'Đặng Thị F',
    email: 'dangthif@gmail.com',
    rating: 5,
    message: 'Nhân viên tư vấn rất nhiệt tình, giúp tôi chọn được sản phẩm phù hợp.',
    date: '2023-10-28',
    product: 'Dịch vụ tư vấn',
    status: 'Chưa phản hồi',
    type: 'Đánh giá dịch vụ'
  }
];

const CustomerFeedback = () => {
  const [feedbacks, setFeedbacks] = useState(feedbackData);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterRating, setFilterRating] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');

  // Filter feedbacks based on selected filters and search term
  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchStatus = filterStatus === 'all' || feedback.status === filterStatus;
    const matchType = filterType === 'all' || feedback.type === filterType;
    const matchRating = filterRating === 'all' || feedback.rating === parseInt(filterRating);
    const matchSearch = 
      feedback.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.product.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchStatus && matchType && matchRating && matchSearch;
  });

  const handleSelectFeedback = (feedback) => {
    setSelectedFeedback(feedback);
    setReplyMessage(''); // Reset reply message when selecting a new feedback
  };

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;
    
    // In a real app, you would send this to an API
    // For this demo, we'll just update the feedback status
    const updatedFeedbacks = feedbacks.map(f => 
      f.id === selectedFeedback.id ? { ...f, status: 'Đã phản hồi' } : f
    );
    
    setFeedbacks(updatedFeedbacks);
    setReplyMessage('');
    alert(`Đã gửi phản hồi đến ${selectedFeedback.customer}`);
  };

  const handleDeleteFeedback = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phản hồi này?')) {
      const updatedFeedbacks = feedbacks.filter(f => f.id !== id);
      setFeedbacks(updatedFeedbacks);
      if (selectedFeedback && selectedFeedback.id === id) {
        setSelectedFeedback(null);
      }
    }
  };

  // Generate star rating display
  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <FiStar 
        key={index} 
        className={`w-4 h-4 ${index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Phản hồi khách hàng</h1>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition flex items-center">
            <FiFilter className="mr-2" />
            Lọc phản hồi
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Filters and Feedback List */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Tìm kiếm phản hồi..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Trạng thái</label>
                <select 
                  className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">Tất cả</option>
                  <option value="Chưa phản hồi">Chưa phản hồi</option>
                  <option value="Đã phản hồi">Đã phản hồi</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Loại</label>
                <select 
                  className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">Tất cả</option>
                  <option value="Đánh giá sản phẩm">Đánh giá sản phẩm</option>
                  <option value="Đánh giá dịch vụ">Đánh giá dịch vụ</option>
                  <option value="Khiếu nại">Khiếu nại</option>
                  <option value="Góp ý">Góp ý</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="overflow-y-auto flex-1">
            {filteredFeedbacks.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                Không tìm thấy phản hồi phù hợp
              </div>
            ) : (
              filteredFeedbacks.map(feedback => (
                <div 
                  key={feedback.id}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${selectedFeedback?.id === feedback.id ? 'bg-red-50' : ''}`}
                  onClick={() => handleSelectFeedback(feedback)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium text-gray-800 truncate">{feedback.customer}</div>
                    <div className="flex">{renderStars(feedback.rating)}</div>
                  </div>
                  <div className="text-sm text-gray-500 mb-2 truncate">{feedback.product}</div>
                  <div className="text-sm text-gray-600 line-clamp-2 mb-2">{feedback.message}</div>
                  <div className="flex justify-between items-center text-xs">
                    <div className="text-gray-500">{new Date(feedback.date).toLocaleDateString('vi-VN')}</div>
                    <div 
                      className={`px-2 py-1 rounded-full text-white ${
                        feedback.status === 'Chưa phản hồi' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                    >
                      {feedback.status}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Feedback Detail */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          {selectedFeedback ? (
            <>
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-1">{selectedFeedback.customer}</h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <FiMail className="mr-1" />
                        {selectedFeedback.email}
                      </div>
                      <div className="flex items-center">
                        <FiCalendar className="mr-1" />
                        {new Date(selectedFeedback.date).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                  </div>
                  <button 
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleDeleteFeedback(selectedFeedback.id)}
                  >
                    <FiTrash2 className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="mt-4 flex items-center space-x-4">
                  <div className="flex items-center">
                    <FiTag className="mr-1 text-gray-500" />
                    <span className="text-sm text-gray-700">{selectedFeedback.product}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-700 mr-2">Đánh giá:</span>
                    <div className="flex">{renderStars(selectedFeedback.rating)}</div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs text-white ${
                    selectedFeedback.type === 'Khiếu nại' 
                      ? 'bg-red-500' 
                      : selectedFeedback.type === 'Góp ý' 
                        ? 'bg-blue-500' 
                        : 'bg-green-500'
                  }`}>
                    {selectedFeedback.type}
                  </div>
                </div>
              </div>
              
              <div className="p-6 flex-1 overflow-y-auto bg-gray-50">
                <div className="bg-white p-4 rounded-lg shadow-sm mb-6 relative">
                  <div className="absolute top-0 left-0 w-1 h-full bg-red-600 rounded-l-lg"></div>
                  <div className="pl-3">
                    <div className="flex items-start mb-2">
                      <FiMessageSquare className="mt-1 mr-2 text-red-600" />
                      <h3 className="font-medium text-gray-800">Nội dung phản hồi</h3>
                    </div>
                    <p className="text-gray-700 whitespace-pre-line">{selectedFeedback.message}</p>
                  </div>
                </div>
                
                {/* Previous replies would go here in a real app */}
                
                <form onSubmit={handleReplySubmit} className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phản hồi
                    </label>
                    <textarea
                      rows="4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Nhập nội dung phản hồi..."
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                    ></textarea>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                      disabled={!replyMessage.trim()}
                    >
                      Gửi phản hồi
                    </button>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 p-6">
              <FiMessageSquare className="h-16 w-16 mb-4 text-gray-300" />
              <h3 className="text-xl font-medium text-gray-600 mb-2">Chưa chọn phản hồi</h3>
              <p className="text-center">Vui lòng chọn một phản hồi từ danh sách bên trái để xem chi tiết.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CustomerFeedback; 