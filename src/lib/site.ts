export const site = {
  name: "CerebroBro",
  title: "CerebroBro — AI that works in production",
  description:
    "Your agency has enough AI experiments. Show me something your team hates making — 20 minutes to see whether AI can actually make it better.",
};

export const contactEmail = "koby@cerebrobro.com";

export const contactHref = "https://cal.com/cerebrobro/diagnosis";

export function openAiPixelId(): string | null {
  const id = process.env.NEXT_PUBLIC_OPENAI_PIXEL_ID?.trim() ?? "";
  if (!/^[A-Za-z0-9_-]+$/.test(id)) return null;
  return id;
}
