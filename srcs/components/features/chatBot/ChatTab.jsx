import { ChatHeader } from "@/components/features/chatBot/ChatHeader";
import {
  BotMessage,
  UserMessage,
} from "@/components/features/chatBot/ChatMessage";
import { ChatInput } from "@/components/features/chatBot/ChatInput";

export default function ChatTab({ onClose }) {
  return (
    <section
      className="
    fixed 
    bottom-[20px]
    right-5
    w-[360px] h-[500px] 
    flex flex-col 
    bg-white 
    border border-gray-300 
    rounded-2xl 
    shadow-lg 
    p-4 
    font-sans 
    z-50
  "
    >
      {/* Nút đóng */}
      <button
        onClick={onClose}
        aria-label="Close Chat"
        className="
          absolute top-6 right-6
          w-8 h-8 flex items-center justify-center
          rounded-full
          hover:bg-gray-200 hover:shadow-md
          transition
          focus:outline-none focus:ring-2 focus:ring-red-400
        "
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
      <main
        className="flex-1 overflow-y-auto space-y-3 py-4 px-2 bg-gray-50 rounded-xl border border-gray-200 mt-2 mb-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
        style={{ scrollbarWidth: "thin" }}
      >
        <BotMessage />
        <UserMessage />
      </main>
      <ChatInput />
    </section>
  );
}
