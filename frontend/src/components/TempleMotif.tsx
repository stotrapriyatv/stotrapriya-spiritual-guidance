export function TempleMotif({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 200"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M160 12c48 0 88 40 88 90v70h-24V102c0-38-28-68-64-68s-64 30-64 68v70H72v-70c0-50 40-90 88-90z"
        stroke="#6E1B1B"
        strokeWidth="2.5"
      />
      <path
        d="M160 40c34 0 60 28 60 62v70"
        stroke="#B9812E"
        strokeWidth="1.5"
        strokeDasharray="2 6"
        strokeLinecap="round"
      />
      <circle cx="160" cy="58" r="6" stroke="#B9812E" strokeWidth="2" />
      <path d="M40 172h240" stroke="#6E1B1B" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M52 172v10M100 172v10M160 172v10M220 172v10M268 172v10" stroke="#B9812E" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
