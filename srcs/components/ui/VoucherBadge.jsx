function VoucherBadge({ code = "GIAMGIA500", color = "#FFC0D3" }) {
  return (
    <div className="relative w-[150px] h-[40px]">
      <svg
        className="w-full h-full"
        viewBox="0 0 150 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background */}
        <rect width="150" height="40" rx="5" fill={color} />

        {/* Hình răng cưa bên trái */}
        <path
          d="M7.5 19.5C7.5 23.6421 4.14214 27 0 27C0 23.5 0 23.6421 0 19.5C0 15.3579 0 15.5 0 12C4.14214 12 7.5 15.3579 7.5 19.5Z"
          fill="white"
        />
      </svg>

      {/* Text overlay */}
      <span className="absolute inset-0 flex items-center justify-center font-bold text-[#EA1A1A] text-[15px] font-sans tracking-wide">
        {code}
      </span>
    </div>
  );
}

export default VoucherBadge;
