import React from "react";

export function ChatInput({ inputValue, setInputValue, onSend, onKeyPress, loading }) {
  return (
    <div className="flex gap-2">
      <textarea
        className="flex-1 border border-gray-300 rounded-md p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={2}
        placeholder="Nhập tin nhắn..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={onKeyPress}
        disabled={loading}
      />
      <button
        onClick={onSend}
        disabled={loading || !inputValue.trim()}
        className={`px-4 py-2 rounded-md text-white font-semibold ${
          loading || !inputValue.trim() ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        Gửi
      </button>
    </div>
  );
}
