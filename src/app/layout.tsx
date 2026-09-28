import type { Metadata } from "next";
import { Geist, Newsreader } from "next/font/google";
import { OpenAiPixel } from "@/components/openai-pixel";
import { openAiPixelId, site } from "@/lib/site";
import "./globals.css";

const sans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const serif = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const pixelId = openAiPixelId();

  return (
    <html
      lang="en"
      className={`${sans.variable} ${serif.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        {pixelId ? <OpenAiPixel pixelId={pixelId} /> : null}
        {children}
      </body>
    </html>
  );
}
