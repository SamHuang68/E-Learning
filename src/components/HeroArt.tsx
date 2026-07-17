export function HeroArt() {
  return (
    <svg
      className="hero-art"
      viewBox="0 0 280 200"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#d7e8f2" />
          <stop offset="100%" stopColor="#b8d4c8" />
        </linearGradient>
        <linearGradient id="mic" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2f6f7e" />
          <stop offset="100%" stopColor="#1f4d63" />
        </linearGradient>
      </defs>
      <rect width="280" height="200" rx="24" fill="url(#sky)" />
      <circle cx="210" cy="48" r="28" fill="#f3e6c8" opacity="0.85" />
      <path
        d="M20 150c30-20 60-20 90 0s60 20 90 0 50-18 70-6"
        stroke="#7ea893"
        strokeWidth="3"
        fill="none"
        opacity="0.55"
      />
      <ellipse cx="140" cy="168" rx="70" ry="10" fill="#1f4d63" opacity="0.12" />
      <rect x="122" y="70" width="36" height="70" rx="18" fill="url(#mic)" />
      <rect x="132" y="140" width="16" height="22" rx="4" fill="#1f4d63" />
      <rect x="118" y="160" width="44" height="8" rx="4" fill="#345868" />
      <path
        d="M95 88c-18 8-28 24-28 42 0 4 2 6 6 6h10c3 0 5-2 5-5 0-14 8-26 22-32"
        stroke="#c45c5c"
        strokeWidth="10"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M185 88c18 8 28 24 28 42 0 4-2 6-6 6h-10c-3 0-5-2-5-5 0-14-8-26-22-32"
        stroke="#c45c5c"
        strokeWidth="10"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="78" cy="78" r="12" fill="#c45c5c" />
      <circle cx="202" cy="78" r="12" fill="#c45c5c" />
      <text
        x="48"
        y="52"
        fill="#1f4d63"
        fontFamily="Shippori Mincho, serif"
        fontSize="22"
        fontWeight="700"
      >
        あ
      </text>
      <text
        x="220"
        y="140"
        fill="#1f4d63"
        fontFamily="Shippori Mincho, serif"
        fontSize="18"
        opacity="0.7"
      >
        語
      </text>
    </svg>
  )
}
