import type { Metadata } from "next";
import { Source_Serif_4, Syne } from "next/font/google";
import { OpenAiPixel } from "@/components/openai-pixel";
import { openAiPixelId, site } from "@/lib/site";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
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
      className={`${syne.variable} ${sourceSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        {pixelId ? <OpenAiPixel pixelId={pixelId} /> : null}
        {children}
      </body>
    </html>
  );
}
