export function LanceLogo({ className }: { className?: string }) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Back L — largest, most offset */}
      <path
        d="M4 4 H9 V22 H22 V27 H4 Z"
        fill="currentColor"
        opacity="0.3"
      />
      {/* Middle L */}
      <path
        d="M8 2 H13 V18 H25 V23 H8 Z"
        fill="currentColor"
        opacity="0.55"
      />
      {/* Front L — smallest, most forward */}
      <path
        d="M12 0 H17 V14 H28 V19 H12 Z"
        fill="currentColor"
      />
    </svg>
  );
}
