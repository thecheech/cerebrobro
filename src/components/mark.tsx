interface WordmarkProps {
  className?: string;
}

export function Wordmark({ className }: WordmarkProps) {
  return (
    <span className={className ? `wordmark ${className}` : "wordmark"}>
      <span className="wordmark-c">C</span>erebroBro
    </span>
  );
}
