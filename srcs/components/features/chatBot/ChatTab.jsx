import React, { useState, useRef, useEffect } from "react";
import { BotMessage, UserMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ChatHeader } from "./ChatHeader";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

// API configuration constants - ensure it points to localhost
const API_BASE_URL = "http://127.0.0.1:8000";

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
  const [apiStatus, setApiStatus] = useState("checking");
  const messagesEndRef = useRef(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    console.log("ChatTab mounted, testing API connection...");
    checkApiConnection();
    
    // Set up interval to check API connection periodically
    const intervalId = setInterval(() => {
      if (apiStatus === "error" && retryCount < 5) {
        console.log(`Retrying API connection (${retryCount + 1}/5)...`);
        checkApiConnection();
        setRetryCount(prev => prev + 1);
      }
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, [apiStatus, retryCount]);

  useEffect(() => {
    scrollToBottom();
    console.log("Messages updated:", messages); // Debug messages state
  }, [messages]);

  const checkApiConnection = () => {
    // Use test endpoint for API connection check
    axios.get(`${API_BASE_URL}/test`)
      .then(response => {
        console.log("API test response:", response.data);
        setApiStatus("connected");
        setRetryCount(0);
      })
      .catch(err => {
        console.error("API test error:", err);
        setApiStatus("error");
      });
  };

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

    console.log("Sending query to chatbot API");
    
    try {
      // Use FormData for the request
      const formData = new FormData();
      formData.append("query", inputValue.trim());
      formData.append("model", mapModelName(model));
      
      console.log("Sending form data:", {
        query: inputValue.trim(),
        model: mapModelName(model)
      });
      
      // Make a direct POST request to the direct-query endpoint
      const response = await axios({
        method: 'post',
        url: `${API_BASE_URL}/direct-query`,
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // Log the response
      console.log("API response:", response);
      
      const data = response.data;
      console.log("Response data:", data);

      const responseData = data?.response || [];
      console.log("Processing responseData:", responseData); // Added debug
      
      // Create detailed consultation message based on query and products
      let consultationText = "";
      if (Array.isArray(responseData) && responseData.length > 0) {
        const priceRange = inputValue.toLowerCase().includes("dưới") ? "trong tầm giá phù hợp" : "với nhiều mức giá khác nhau";
        
        // Check if query is about laptops
        if (inputValue.toLowerCase().includes("laptop")) {
          consultationText = `Dạ, về laptop ${priceRange} thì em xin tư vấn cho anh/chị một số sản phẩm phù hợp với nhu cầu. ` +
          `Hiện tại cửa hàng đang có ${responseData.length} mẫu laptop đang được ưa chuộng, với cấu hình và thiết kế đa dạng. ` +
          `Anh/chị có thể tham khảo các sản phẩm bên dưới ạ:`;
        } 
        // Check if query is about PC components
        else if (inputValue.toLowerCase().includes("pc") || inputValue.toLowerCase().includes("máy tính")) {
          consultationText = `Về máy tính ${priceRange}, em xin giới thiệu một số sản phẩm phù hợp với nhu cầu của anh/chị. ` +
          `Cửa hàng có nhiều cấu hình PC với hiệu năng khác nhau phù hợp cho cả công việc và giải trí. ` +
          `Dưới đây là một số gợi ý mà em nghĩ sẽ phù hợp:`;
        }
        // Generic response for other product categories
        else {
          consultationText = `Dạ, theo yêu cầu của anh/chị, em xin tư vấn một số sản phẩm ${priceRange}. ` +
          `Các sản phẩm này đều được nhiều khách hàng đánh giá cao về chất lượng và hiệu năng. ` +
          `Anh/chị có thể tham khảo thông tin chi tiết bên dưới:`;
        }
      } else {
        consultationText = "Xin lỗi, em không tìm thấy sản phẩm nào phù hợp với yêu cầu của anh/chị. " + 
          "Anh/chị có thể mô tả lại nhu cầu cụ thể hơn được không ạ? Ví dụ như tầm giá, thương hiệu ưa thích, " +
          "hoặc mục đích sử dụng để em có thể tư vấn tốt hơn.";
      }
      
      const botMsg = {
        id: uuidv4(),
        from: "bot",
        text: consultationText,
        products: Array.isArray(responseData) ? responseData : null,
      };

      console.log("Adding bot message:", botMsg); // Added debug
      setMessages((prev) => {
        const newMessages = [...prev, botMsg];
        console.log("New messages state:", newMessages); // Added debug
        return newMessages;
      });
      setApiStatus("connected");
    } catch (error) {
      console.error("API Error:", error);
      
      let errorMessage = "Không thể kết nối đến máy chủ";
      if (error.response) {
        // The request was made and the server responded with a status code
        errorMessage = `Lỗi từ máy chủ: ${error.response.status} - ${error.response.data?.detail || "Unknown error"}`;
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = "Không nhận được phản hồi từ máy chủ. Vui lòng kiểm tra kết nối mạng và đảm bảo máy chủ đang chạy.";
        setApiStatus("error");
      } else {
        // Something happened in setting up the request
        errorMessage = `Lỗi: ${error.message}`;
      }
      
      const errorMsg = {
        id: uuidv4(),
        from: "bot",
        text: errorMessage,
      };
      console.log("Adding error message:", errorMsg); // Added debug
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

  const handleRetryConnection = () => {
    setApiStatus("checking");
    checkApiConnection();
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

      {apiStatus === "checking" && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded mt-2 text-sm">
          Đang kiểm tra kết nối API...
        </div>
      )}

      {apiStatus === "error" && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mt-2 text-sm">
          <p>API không kết nối được. Vui lòng kiểm tra lại máy chủ.</p>
          <button 
            onClick={handleRetryConnection}
            className="mt-1 px-2 py-1 bg-red-200 hover:bg-red-300 rounded text-xs"
          >
            Thử lại kết nối
          </button>
        </div>
      )}

      <main
        className="flex-1 overflow-y-auto space-y-3 py-4 px-2 bg-gray-50 rounded-xl border border-gray-200 mt-3 mb-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
        style={{ scrollbarWidth: "thin" }}
      >
        {messages.length > 0 ? (
          messages.map((msg) =>
            msg.from === "bot" ? (
              <BotMessage key={msg.id} text={msg.text} products={msg.products} />
            ) : (
              <UserMessage key={msg.id} text={msg.text} />
            )
          )
        ) : (
          <div className="text-center text-gray-500 py-4">Không có tin nhắn</div>
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
        disabled={apiStatus === "error"}
      />
    </section>
  );
}
