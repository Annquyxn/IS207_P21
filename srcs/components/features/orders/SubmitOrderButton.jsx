function SubmitOrderButton() {
  return (
    <div className="flex justify-center">
      <button
        className="mt-6 rounded-xl bg-black text-white h-[60px] w-[200px] text-2xl font-semibold border border-black 
             hover:bg-gray-700 hover:scale-105 hover:shadow-xl 
             active:bg-gray-900 
             focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-50 
             transition-all duration-300 ease-in-out"
      >
        Đặt hàng
      </button>
    </div>
  );
}

export default SubmitOrderButton;
