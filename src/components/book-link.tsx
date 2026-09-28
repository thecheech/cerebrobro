import type { ReactNode } from "react";
import { bookingUrl } from "@/lib/site";

export function BookLink({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const href = bookingUrl() ?? "#talk";

  return (
    <a className={className} href={href}>
      {children}
    </a>
  );
}
