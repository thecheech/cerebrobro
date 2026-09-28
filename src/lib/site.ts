export const site = {
  name: "CerebroBro",
  title: "CerebroBro — AI that works in production",
  description:
    "I've been building and operating AI image and video products. CerebroBro is where I apply that to the messy, expensive work creative teams actually ship.",
};

export const contactEmail = "koby@cerebrobro.com";

export const contactHref = "https://cal.com/cerebrobro/diagnosis";

export function openAiPixelId(): string | null {
  const id = process.env.NEXT_PUBLIC_OPENAI_PIXEL_ID?.trim() ?? "";
  if (!/^[A-Za-z0-9_-]+$/.test(id)) return null;
  return id;
}
