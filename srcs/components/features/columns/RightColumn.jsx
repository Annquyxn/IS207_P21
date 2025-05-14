function RightColumn() {
  return (
    <section className="min-w-[320px] flex flex-col gap-6 p-4 font-sans">
      {/* Combo Loa + Tai nghe */}
      <div className="bg-white border rounded-2xl shadow-md p-5 transition-transform transform hover:scale-105 hover:shadow-lg group">
        <h2 className="font-bold text-xl text-gray-900 mb-2">
          COMBO Loa + Tai nghe
        </h2>
        <div className="text-lg mb-3 flex items-center gap-2">
          <span className="text-red-600 font-bold">450.000</span>
          <span className="underline text-black">đ</span>
          <span className="line-through text-gray-500 ml-2 text-sm">
            599.000đ
          </span>
        </div>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/61e20630339a7ea46d90f807bfd5ed1c17e627b5"
          alt="Combo"
          className="w-28 mx-auto mb-5 transition-transform duration-300 group-hover:scale-110"
        />
        <button className="bg-black text-white font-semibold py-2 px-5 rounded-full w-full hover:bg-gray-800 hover:scale-105 transition duration-200">
          Thêm vào giỏ hàng
        </button>
      </div>

      {/* Bàn phím */}
      <div className="bg-white border rounded-2xl shadow-md p-5 transition-transform transform hover:scale-105 hover:shadow-lg group">
        <h2 className="font-bold text-xl text-gray-900 mb-2">Bàn phím</h2>
        <div className="text-lg mb-3 flex items-center gap-2">
          <span className="text-red-600 font-bold">600.000</span>
          <span className="underline text-black">đ</span>
          <span className="line-through text-gray-500 ml-2 text-sm">
            990.000đ
          </span>
        </div>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/952c8a0bed38526fe69c58ab92a36b4e36d35d5b"
          alt="Keyboard"
          className="w-52 mx-auto mb-5 transition-transform duration-300 group-hover:scale-110"
        />
        <button className="bg-black text-white font-semibold py-2 px-5 rounded-full w-full hover:bg-gray-800 hover:scale-105 transition duration-200">
          Thêm vào giỏ hàng
        </button>
      </div>
    </section>
  );
}

export default RightColumn;
