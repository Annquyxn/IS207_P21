function CenterColumn() {
  return (
    <section className="min-w-[320px] bg-white border p-5 rounded-2xl shadow-md text-center flex flex-col items-center justify-center transition transform hover:scale-[1.02] hover:shadow-lg duration-300 font-sans">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
        SIÊU SALE HÈ
      </h1>
      <p className="text-xl border border-black px-6 py-4 inline-block font-medium text-gray-800">
        Giảm giá 20%
        <br />
        Tất cả đơn từ 300K
      </p>
      <div className="flex justify-between items-center w-full max-w-xs my-6 px-4">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/c00b73b05b853208dae43026f9ae07b9827b33eb"
          alt="Left"
          className="w-6 cursor-pointer hover:scale-110 transition"
        />
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/953912f37c5c719087ac89e5040df12874d93648"
          alt="Right"
          className="w-6 cursor-pointer hover:scale-110 transition"
        />
      </div>
      <button className="flex items-center gap-2 bg-black text-white px-5 py-3 rounded-full hover:bg-gray-800 hover:scale-105 transition duration-200">
        Mua hàng
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/e1d5adfb4dc21c8788e1e448dac023227e8a84b4"
          alt="Arrow"
          className="w-4"
        />
      </button>
    </section>
  );
}

export default CenterColumn;
