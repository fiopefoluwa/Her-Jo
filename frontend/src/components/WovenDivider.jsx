export function WovenDivider() {
  return (
    <svg
      width="100%"
      height="2"
      viewBox="0 0 800 2"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      className="my-8"
    >
      <pattern
        id="woven-pattern"
        x="0"
        y="0"
        width="40"
        height="2"
        patternUnits="userSpaceOnUse"
      >
        <line
          x1="0"
          y1="1"
          x2="20"
          y2="1"
          stroke="rgba(43, 37, 32, 0.2)"
          strokeWidth="1.5"
        />
        <line
          x1="25"
          y1="1"
          x2="35"
          y2="1"
          stroke="rgba(184, 92, 66, 0.3)"
          strokeWidth="1.5"
        />
      </pattern>
      <rect width="800" height="2" fill="url(#woven-pattern)" />
    </svg>
  );
}
