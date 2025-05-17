import React, { useState } from "react";
import axios from "axios";
import { BotMessage, UserMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ChatHeader } from "./ChatHeader";

export default function ChatTab({ onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: "bot",
      text: "Xin kính chào quý khách, TechBot xin hân hạnh phục vụ và giải đáp các thắc mắc của quý khách.",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [language, setLanguage] = useState("English");
  const [model, setModel] = useState("llama3");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMsg = { id: Date.now(), from: "user", text: inputValue };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/home", {
        text: inputValue,
        language,
        model,
      });

      const botMsg = {
        id: Date.now() + 1,
        from: "bot",
        text: response.data.result,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      const errorMsg = {
        id: Date.now() + 1,
        from: "bot",
        text: "Có lỗi xảy ra, vui lòng thử lại sau.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="fixed bottom-[20px] right-5 w-[370px] h-[550px] flex flex-col bg-white border border-gray-300 rounded-2xl shadow-lg p-4 font-sans z-50">
      <button
        onClick={onClose}
        aria-label="Close Chat"
        className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-red-400"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <ChatHeader />

      {/* --- Language + Model Selection --- */}
      <div className="flex items-center justify-between mt-2 gap-2">
        <select
          className="w-1/2 p-1 border border-gray-300 rounded-md text-sm"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="Vietnamese">🇻🇳 Tiếng Việt</option>
          <option value="English">🇬🇧 English</option>
          <option value="Chinese">🇨🇳 Chinese</option>
          <option value="French">🇫🇷 French</option>
        </select>
        <select
          className="w-1/2 p-1 border border-gray-300 rounded-md text-sm"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        >
          <option value="llama3">LLaMA3-70B</option>
          <option value="llama2">LLaMA2-70B</option>
          <option value="mixtral">Mixtral-8x7B</option>
          <option value="gemma">Gemma-7B</option>
          <option value="qwen">Qwen-32B</option>
          <option value="deepseek">DeepSeek-33B</option>
        </select>
      </div>

      {/* --- Chat Area --- */}
      <main
        className="flex-1 overflow-y-auto space-y-3 py-4 px-2 bg-gray-50 rounded-xl border border-gray-200 mt-3 mb-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
        style={{ scrollbarWidth: "thin" }}
      >
        {messages.map((msg) =>
          msg.from === "bot" ? (
            <BotMessage key={msg.id} text={msg.text} />
          ) : (
            <UserMessage key={msg.id} text={msg.text} />
          )
        )}
        {loading && <BotMessage text="Đang suy nghĩ..." />}
      </main>

      {/* --- Chat Input --- */}
      <ChatInput
        inputValue={inputValue}
        setInputValue={setInputValue}
        onSend={sendMessage}
      />
    </section>
  );
}
