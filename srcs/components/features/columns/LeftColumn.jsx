function LeftColumn() {
  return (
    <section className="min-w-[320px] flex flex-col gap-6 p-4 font-sans">
      {/** Chuột máy tính */}
      <div className="bg-white border rounded-2xl shadow-md p-5 text-center transition duration-300 transform hover:scale-105 hover:shadow-lg group">
        <h2 className="font-bold text-xl text-gray-900 mb-2">Chuột máy tính</h2>
        <p className="text-lg font-medium text-gray-800 mb-3">
          Giảm giá <span className="text-red-600 font-bold text-2xl">50%</span>
        </p>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/1e82983ce2bddc9366dda2e6a4b9fc571a463f41"
          alt="Mouse"
          className="mx-auto w-36 mb-4 transition-transform duration-300 group-hover:scale-110"
        />
        <button className="bg-black text-white font-semibold py-2 px-5 rounded-full transition hover:bg-gray-800 hover:scale-105 duration-200">
          Thêm vào giỏ hàng
        </button>
      </div>

      {/** Mẫu mới */}
      <div className="bg-white border rounded-2xl shadow-md p-5 text-center transition duration-300 transform hover:scale-105 hover:shadow-lg group">
        <p className="text-xl font-bold text-gray-900 mb-3">Mẫu mới</p>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/112fecdc0782c3e4df81f2932d93146976d382bc"
          alt="New Model"
          className="mx-auto w-40 mb-4 transition-transform duration-300 group-hover:scale-110"
        />
        <button className="bg-black text-white font-semibold py-2 px-5 rounded-full transition hover:bg-gray-800 hover:scale-105 duration-200">
          Thêm vào giỏ hàng
        </button>
      </div>
    </section>
  );
}

export default LeftColumn;
