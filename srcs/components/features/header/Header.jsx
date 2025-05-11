import { IonIcon } from "@ionic/react";

function Header() {
  return (
    <header className="bg-red-600 text-white py-3 px-6 shadow-lg sticky top-0 z-50">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left Section */}
        <div className="flex items-center gap-4 flex-grow">
          <div className="flex items-center gap-2 bg-red-700 px-4 py-2 rounded-lg cursor-pointer">
            <span className="text-lg">Danh mục</span>
            <IonIcon name="chevron-down-outline" className="text-xl mt-1" />
          </div>

          <div className="relative flex-grow max-w-xl">
            <div className="bg-white flex items-center rounded-full px-6 py-2">
              <input
                type="text"
                placeholder="Tìm kiếm"
                className="flex-grow outline-none text-gray-800 bg-transparent"
              />
              <IonIcon
                name="search-outline"
                className="text-2xl text-gray-600 ml-2"
              />
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 cursor-pointer hover:bg-red-700 px-3 py-2 rounded-lg">
            <IonIcon name="location-outline" className="text-2xl" />
            <span className="text-sm">Địa chỉ</span>
          </div>

          <div className="flex items-center gap-2 cursor-pointer hover:bg-red-700 px-3 py-2 rounded-lg">
            <IonIcon name="notifications-outline" className="text-2xl" />
            <span className="text-sm">Thông báo</span>
          </div>

          <div className="flex items-center gap-2 cursor-pointer hover:bg-red-700 px-3 py-2 rounded-lg">
            <IonIcon name="cart-outline" className="text-2xl" />
            <span className="text-sm">Giỏ hàng</span>
          </div>

          <div className="flex items-center gap-2 bg-orange-500 px-4 py-2 rounded-full cursor-pointer hover:bg-orange-600">
            <IonIcon name="person-outline" className="text-2xl" />
            <span className="text-sm">Đăng nhập</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
