import { ChatHeader } from "@/components/features/chatBot/ChatHeader";
import {
  BotMessage,
  UserMessage,
} from "@/components/features/chatBot/ChatMessage";
import { ChatInput } from "@/components/features/chatBot/ChatInput";

export default function ChatTab() {
  return (
    <section className="relative w-[360px] bg-white border border-black rounded-2xl p-4 h-[500px] flex flex-col">
      <ChatHeader />
      <main className="flex-1 overflow-y-auto py-4">
        <BotMessage />
        <UserMessage />
      </main>
      <ChatInput />
    </section>
  );
}
