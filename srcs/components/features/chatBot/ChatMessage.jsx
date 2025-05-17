export function BotMessage({ text }) {
  return (
    <article className="flex gap-3 items-start mt-4">
      <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-sm">
        B
      </div>
      <div className="bg-pink-100 rounded-2xl px-4 py-2 text-base font-sans leading-relaxed shadow-md max-w-[75%]">
        <p>{text}</p>
      </div>
    </article>
  );
}

export function UserMessage({ text }) {
  return (
    <article className="flex justify-end mt-6">
      <div className="flex items-end gap-3 max-w-[75%]">
        <div className="bg-gray-200 px-4 py-2 rounded-2xl text-base font-sans leading-relaxed shadow">
          {text}
        </div>
        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold text-sm">
          U
        </div>
      </div>
    </article>
  );
}
