export function ChatInput() {
  return (
    <footer className="absolute bottom-0 left-0 right-0 p-4 flex items-center gap-3">
      <input
        type="text"
        placeholder="Nhập nội dung"
        className="flex-1 h-10 px-3 rounded-lg border border-black text-sm text-[#5d5a5a] font-inter"
      />
      <button className="w-[45px] h-[45px] rounded-full bg-[#e40000] flex items-center justify-center">
        <svg
          className="w-4 h-4"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 17V1M9 1L1 9M9 1L17 9"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </footer>
  );
}
