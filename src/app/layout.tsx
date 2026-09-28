import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import { OpenAiPixel } from "@/components/openai-pixel";
import { openAiPixelId, site } from "@/lib/site";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const pixelId = openAiPixelId();

  return (
    <html lang="en" className={`${archivo.variable} h-full antialiased`}>
      <body className="min-h-full">
        {pixelId ? <OpenAiPixel pixelId={pixelId} /> : null}
        {children}
      </body>
    </html>
  );
}
