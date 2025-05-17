// === ChatTab.jsx ===
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { BotMessage, UserMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ChatHeader } from "./ChatHeader";
import { v4 as uuidv4 } from "uuid";

const API_URL = "http://127.0.0.1:8000/products";

export default function ChatTab({ onClose }) {
  const [messages, setMessages] = useState([
    {
      id: uuidv4(),
      from: "bot",
      text: "Xin kính chào quý khách, TechBot xin hân hạnh phục vụ và giải đáp các thắc mắc của quý khách.",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [model, setModel] = useState("deepseek");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const mapModelName = (model) => {
    const modelMap = {
      llama3: "llama3",
      llama2: "llama2",
      mixtral: "mixtral",
      gemma: "gemma",
      qwen: "qwen",
      deepseek: "deepseek",
    };
    return modelMap[model] || model;
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || loading) return;

    const userMsg = { id: uuidv4(), from: "user", text: inputValue };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setLoading(true);

    const payload = {
      query: inputValue.trim(),
      model: mapModelName(model),
    };

    try {
      const response = await axios.post(API_URL, payload, {
        headers: { "Content-Type": "application/json" },
      });

      const responseData = response.data?.response || [];
      const botMsg = {
        id: uuidv4(),
        from: "bot",
        text:
          Array.isArray(responseData) && responseData.length > 0
            ? "Dưới đây là sản phẩm phù hợp với yêu cầu của bạn:"
            : "Xin lỗi, không tìm thấy sản phẩm phù hợp!",
        products: Array.isArray(responseData) ? responseData : null,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      const errorMsg = {
        id: uuidv4(),
        from: "bot",
        text:
          error.response?.status === 404
            ? "Không tìm thấy dữ liệu sản phẩm."
            : "Có lỗi xảy ra, vui lòng thử lại sau.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <section className="fixed bottom-[20px] right-5 w-[370px] h-[550px] flex flex-col bg-white border border-gray-300 rounded-2xl shadow-lg p-4 font-sans z-50">
      <button
        onClick={onClose}
        aria-label="Close Chat"
        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-red-400"
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

      <div className="flex items-center justify-between mt-2 gap-2">
        <select
          className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          disabled={loading}
        >
          <option value="llama3">LLaMA3</option>
          <option value="llama2">LLaMA2</option>
          <option value="mixtral">Mixtral</option>
          <option value="gemma">Gemma</option>
          <option value="qwen">Qwen</option>
          <option value="deepseek">DeepSeek</option>
        </select>
      </div>

      <main
        className="flex-1 overflow-y-auto space-y-3 py-4 px-2 bg-gray-50 rounded-xl border border-gray-200 mt-3 mb-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
        style={{ scrollbarWidth: "thin" }}
      >
        {messages.map((msg) =>
          msg.from === "bot" ? (
            <BotMessage key={msg.id} text={msg.text} products={msg.products} />
          ) : (
            <UserMessage key={msg.id} text={msg.text} />
          )
        )}
        {loading && <BotMessage text="Đang tìm kiếm sản phẩm phù hợp..." />}
        <div ref={messagesEndRef} />
      </main>

      <ChatInput
        inputValue={inputValue}
        setInputValue={setInputValue}
        onSend={sendMessage}
        onKeyPress={handleKeyPress}
        loading={loading}
      />
    </section>
  );
}
