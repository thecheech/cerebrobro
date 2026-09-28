export const site = {
  name: "CerebroBro",
  title: "CerebroBro — AI that works in production",
  description:
    "For creative agencies already experimenting with AI image and video. Talk to Koby. 20 minutes. No sales deck.",
};

export function bookingUrl(): string | null {
  const url = process.env.NEXT_PUBLIC_BOOKING_URL?.trim() ?? "";
  if (!url.startsWith("https://")) return null;
  return url;
}

export function openAiPixelId(): string | null {
  const id = process.env.NEXT_PUBLIC_OPENAI_PIXEL_ID?.trim() ?? "";
  if (!/^[A-Za-z0-9_-]+$/.test(id)) return null;
  return id;
}
