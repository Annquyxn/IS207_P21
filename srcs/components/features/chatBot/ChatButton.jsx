export default function ChatButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label="Open Chat Bot"
      className="
        fixed bottom-6 right-10
        w-[70px] h-[70px]
        z-50
        transition-transform duration-200 ease-in-out
        transform hover:scale-110 active:scale-95
        focus:outline-none
      "
    >
      <img
        src="Button_ChatBot.svg"
        alt="Chatbot Icon"
        className="w-full h-full object-contain"
      />
    </button>
  );
}
