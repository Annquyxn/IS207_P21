function VoucherBadge() {
  return (
    <svg
      className="w-[150px] h-[40px]"
      viewBox="0 0 150 40"
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="150" height="40" rx="5" fill="#FFC0D3" />
      <path
        d="M7.50011 19.5C7.50011 23.6421 4.14224 27 0.000104591 27C0.000101328 23.5 3.26355e-06 23.6421 3.26355e-06 19.5C3.26355e-06 15.3579 3.26355e-06 15.5 0.000104591 12C4.14224 12 7.50011 15.3579 7.50011 19.5Z"
        fill="white"
      />
      <text
        fill="#EA1A1A"
        xmlSpace="preserve"
        style={{ whiteSpace: "pre" }}
        fontFamily="Inter"
        fontSize="15"
        fontWeight="bold"
        letterSpacing="0em"
      >
        <tspan x="26" y="26.4545">
          GIAMGIA500
        </tspan>
      </text>
    </svg>
  );
}

export default VoucherBadge;
