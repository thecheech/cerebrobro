import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Booked — CerebroBro",
  robots: { index: false, follow: false },
};

export default function Thanks() {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col px-6 py-16 sm:px-10">
      <p className="text-sm uppercase tracking-[0.16em] text-accent">Booked</p>
      <h1 className="mt-5 max-w-xl font-serif text-4xl leading-tight font-medium sm:text-5xl">
        The 20 minutes are on the calendar.
      </h1>
      <p className="mt-6 max-w-xl text-lg leading-8 text-muted">
        Bring one client ask, and how the team makes work today. Twenty
        minutes. I&apos;ll tell you whether any of it belongs in production.
      </p>
    </div>
  );
}
