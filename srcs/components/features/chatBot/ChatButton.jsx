export default function ChatButton({ onClick }) {
  return (
    <button
      className="w-[70px] h-[60px] bg-[#EA1A1A] rounded-[15px] hover:scale-105 transition-transform focus:outline focus:outline-2 focus:outline-red-600"
      onClick={onClick}
      aria-label="Open Chat Bot"
    >
      <svg
        className="w-[70px] h-[60px]"
        viewBox="0 0 70 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="70" height="60" rx="15" fill="#EA1A1A" />
        <path
          d="M50 18.4286H35H20C17.2386 18.4286 15 20.5605 15 23.1905V42.2381C15 44.868 17.2386 47 20 47H50C52.7614 47 55 44.868 55 42.2381V23.1905C55 20.5605 52.7614 18.4286 50 18.4286Z"
          fill="#D9D9D9"
        />
        <path
          d="M35 18.4286L39.1667 13.0952L32.0833 7"
          stroke="black"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
