export function ArrowIcon({
  direction = "up-right",
}: {
  direction?: "up-right" | "left" | "right" | "down";
}) {
  const rotation = { "up-right": 0, left: -135, right: 45, down: 135 }[
    direction
  ];
  return (
    <svg
      className="arrow-icon"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <path
        d="M5 19 19 5M5 5h14v14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export function SocialIcon({ name }: { name: "X" | "LinkedIn" | "Instagram" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      fill={name === "Instagram" ? "none" : "currentColor"}
    >
      {name === "X" && (
        <path d="M18.9 2.5h3.2l-7.1 8.1 8.3 10.9h-6.5l-5.1-6.7-5.9 6.7H2.6l7.6-8.7L2.2 2.5h6.7l4.6 6.1 5.4-6.1Zm-1.1 17.1h1.8L7.9 4.3H6l11.8 15.3Z" />
      )}
      {name === "LinkedIn" && (
        <>
          <path d="M2 8h4v14H2zM9 8h4v1.9c.8-1.5 2.1-2.2 4-2.2 3.4 0 5 2.1 5 6V22h-4v-7.4c0-2-.6-3.2-2.4-3.2-1.7 0-2.6 1.2-2.6 3.2V22H9V8Z" />
          <circle cx="4" cy="3.7" r="2.3" />
        </>
      )}
      {name === "Instagram" && (
        <>
          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="5"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle
            cx="12"
            cy="12"
            r="4.2"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle cx="17.8" cy="6.3" r="1.2" fill="currentColor" />
        </>
      )}
    </svg>
  );
}
