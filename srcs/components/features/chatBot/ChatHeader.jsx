export function ChatHeader() {
  return (
    <header className="w-[360px] h-[90px] relative">
      <svg
        className="w-full h-full"
        viewBox="0 0 360 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 15C0 6.71573 6.71573 0 15 0H360V90H0V15Z" fill="#EA1A1A" />
        <text
          className="fill-white font-[Lalezar] text-[30px]"
          x="116"
          y="56.365"
        >
          TECHBOT TƯ VẤN
        </text>
      </svg>
    </header>
  );
}
