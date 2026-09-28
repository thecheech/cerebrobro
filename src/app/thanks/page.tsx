import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Booked — CerebroBro",
  robots: { index: false, follow: false },
};

export default function Thanks() {
  return (
    <div className="thanks">
      <p className="eyebrow">Booked</p>
      <h1>The 20 minutes are on the calendar.</h1>
      <p>
        Bring something your team hates making. If AI isn&apos;t the answer,
        I&apos;ll tell you.
      </p>
    </div>
  );
}
