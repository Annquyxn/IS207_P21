import React from "react";

export function ChatInput({ inputValue, setInputValue, onSend, onKeyPress, loading, disabled }) {
  const isDisabled = loading || disabled;
  const isButtonDisabled = isDisabled || !inputValue.trim();

  return (
    <div className="flex gap-2">
      <textarea
        className={`flex-1 border border-gray-300 rounded-md p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          isDisabled ? "bg-gray-100" : ""
        }`}
        rows={2}
        placeholder={disabled ? "API không khả dụng..." : "Nhập tin nhắn..."}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={onKeyPress}
        disabled={isDisabled}
      />
      <button
        onClick={onSend}
        disabled={isButtonDisabled}
        className={`px-4 py-2 rounded-md text-white font-semibold ${
          isButtonDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
        title={disabled ? "API không khả dụng" : loading ? "Đang xử lý..." : "Gửi tin nhắn"}
      >
        Gửi
      </button>
    </div>
  );
}
