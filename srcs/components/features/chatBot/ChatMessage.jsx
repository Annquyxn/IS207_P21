export function BotMessage() {
  return (
    <article className="flex gap-3 items-start mt-4">
      {/* Avatar Bot */}
      <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-sm">
        B
      </div>

      {/* Bong bóng chat */}
      <div className="bg-pink-100 rounded-2xl px-4 py-2 text-base font-sans leading-relaxed shadow-md max-w-[75%]">
        <p>
          Xin kính chào quý khách, TechBot xin hân hạnh phục vụ và giải đáp các
          thắc mắc của quý khách{" "}
        </p>
      </div>
    </article>
  );
}

export function UserMessage() {
  return (
    <article className="flex justify-end mt-6">
      <div className="flex items-end gap-3 max-w-[75%]">
        {/* Bong bóng người dùng */}
        <div className="bg-gray-200 px-4 py-2 rounded-2xl text-base font-sans leading-relaxed shadow">
          Xin chào TechBot
        </div>

        {/* Avatar User */}
        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold text-sm">
          U
        </div>
      </div>
    </article>
  );
}
