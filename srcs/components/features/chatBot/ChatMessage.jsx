export function BotMessage() {
  return (
    <article className="flex gap-4 mt-2">
      <div className="bg-[#FADBE4] rounded-lg p-4 text-sm font-inter">
        <p>Xin kính chào quý khách,</p>
        <p>TechBot xin hân hạnh phục vụ</p>
        <p>và giải đáp các thắc mắc của</p>
        <p>quý khách.</p>
      </div>
    </article>
  );
}

export function UserMessage() {
  return (
    <article className="flex justify-end mt-8">
      <div className="flex items-center gap-2">
        <span className="bg-[#D9D9D9] px-2 py-1 rounded text-sm font-inter">
          Xin chào TechBot
        </span>
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19 21V19C19 17.9391 18.5786 16.9217 17.8284 16.1716C17.0783 15.4214 16.0609 15 15 15H9C7.93913 15 6.92172 15.4214 6.17157 16.1716C5.42143 16.9217 5 17.9391 5 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </article>
  );
}
