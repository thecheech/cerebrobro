interface MarkProps {
  className?: string;
  plate?: string;
  ink?: string;
}

export function Mark({
  className,
  plate = "var(--signal)",
  ink = "var(--ink)",
}: MarkProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
    >
      <rect width="32" height="32" fill={plate} />
      <path
        fill={ink}
        fillRule="evenodd"
        d="M16 5C9.1 5 4 10.1 4 16C4 21.9 9.1 27 16 27C20.6 27 24.5 24.5 26.6 20.8L20.8 17.4C19.8 19.2 18 20.5 16 20.5C13.2 20.5 11 18.3 11 16C11 13.7 13.2 11.5 16 11.5C18 11.5 19.8 12.8 20.8 14.6L26.6 11.2C24.5 7.5 20.6 5 16 5Z"
      />
    </svg>
  );
}

interface WordmarkProps {
  className?: string;
  markClassName?: string;
  size?: "nav" | "hero" | "footer";
}

/** Block mark replaces the leading C — never Mark + "CerebroBro". */
export function Wordmark({
  className,
  markClassName,
  size = "nav",
}: WordmarkProps) {
  return (
    <span className={className ?? `wordmark wordmark-${size}`}>
      <Mark className={markClassName ?? `wordmark-mark wordmark-mark-${size}`} />
      <span className="wordmark-rest" aria-hidden="true">
        erebroBro
      </span>
    </span>
  );
}
