import { useState } from "react";
import ChatButton from "@/components/features/chatBot/ChatButton";
import ChatTab from "@/components/features/chatBot/ChatTab";

export default function ChatBotContainer() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => setIsOpen((prev) => !prev);
  const closeChat = () => setIsOpen(false);

  return (
    <>
      {!isOpen && <ChatButton onClick={toggleChat} />}
      {isOpen && (
        <div className="fixed bottom-[80px] right-10 z-50">
          <ChatTab onClose={closeChat} />
        </div>
      )}
    </>
  );
}
