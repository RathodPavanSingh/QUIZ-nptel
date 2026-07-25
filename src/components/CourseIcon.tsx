type IconProps = { name: string; className?: string };

// Small inline SVG icons keyed by name in the DB.
export function CourseIcon({ name, className = "w-7 h-7" }: IconProps) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    viewBox: "0 0 24 24",
    className,
  };

  switch (name) {
    case "cloud":
      return (
        <svg {...common}>
          <path d="M17.5 19a4.5 4.5 0 1 0-.4-8.98A6 6 0 0 0 5 12a5 5 0 0 0 .5 9.99h12" />
        </svg>
      );
    case "network":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="6" rx="1.5" />
          <rect x="4" y="14" width="16" height="6" rx="1.5" />
          <circle cx="7.5" cy="7" r="0.5" fill="currentColor" />
          <circle cx="7.5" cy="17" r="0.5" fill="currentColor" />
        </svg>
      );
    case "chart":
      return (
        <svg {...common}>
          <path d="M4 20V10" />
          <path d="M10 20V4" />
          <path d="M16 20v-8" />
          <path d="M2 20h20" />
        </svg>
      );
    case "activity":
      return (
        <svg {...common}>
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      );
    case "brain":
      return (
        <svg {...common}>
          <path d="M12 5a3 3 0 0 0-5.99.2 3 3 0 0 0-.6 5.6 3 3 0 0 0 .6 5.6A3 3 0 0 0 12 19a3 3 0 0 0 5.99-.6 3 3 0 0 0 .6-5.6 3 3 0 0 0-.6-5.6A3 3 0 0 0 12 5Z" />
        </svg>
      );
    case "database":
      return (
        <svg {...common}>
          <ellipse cx="12" cy="5" rx="8" ry="3" />
          <path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
          <path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
        </svg>
      );
    case "laptop":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="12" rx="2" />
          <path d="M2 20h20" />
        </svg>
      );
    case "keyboard":
      return (
        <svg {...common}>
          <rect x="2" y="6" width="20" height="12" rx="2" />
          <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
  }
}
