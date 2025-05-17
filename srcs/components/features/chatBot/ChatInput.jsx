export function ChatInput({ inputValue, setInputValue, onSend }) {
  return (
    <footer className="w-full px-4 pt-2 pb-4 bg-white">
      <div className="max-w-2xl mx-auto flex items-center gap-3 border border-gray-300 rounded-full px-4 py-2 shadow-sm">
        <input
          type="text"
          placeholder="Nhập nội dung..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && inputValue.trim() !== "") {
              onSend();
            }
          }}
          className="flex-1 text-sm text-gray-800 font-sans focus:outline-none placeholder:text-gray-400"
        />
        <button
          onClick={onSend}
          disabled={inputValue.trim() === ""}
          className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center hover:bg-red-700 transition disabled:opacity-50"
        >
          <svg
            className="w-5 h-5"
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
      </div>
    </footer>
  );
}
