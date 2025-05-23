function UserDropdownMenu({
  onClose,
  onGoToUser,
  onGoToOrders,
  onSignOut,
  isAdmin,
}) {
  return (
    <div className='absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg py-2 z-50'>
      <button
        className='w-full text-left px-4 py-2 hover:bg-gray-100'
        onClick={() => {
          onGoToUser();
          onClose();
        }}
      >
        Thông tin tài khoản
      </button>
      <button
        className='w-full text-left px-4 py-2 hover:bg-gray-100'
        onClick={() => {
          onGoToOrders();
          onClose();
        }}
      >
        Đơn hàng của tôi
      </button>
      {isAdmin && (
        <button
          className='w-full text-left px-4 py-2 hover:bg-gray-100 text-blue-600'
          onClick={() => {
            onClose();
            window.location.href = '/admin';
          }}
        >
          Quản lý
        </button>
      )}
      <button
        className='w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600'
        onClick={() => {
          onSignOut();
          onClose();
        }}
      >
        Đăng xuất
      </button>
    </div>
  );
}

export default UserDropdownMenu;
