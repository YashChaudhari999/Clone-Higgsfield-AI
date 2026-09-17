import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Forge — AI Creative Studio",
  description: "Create stunning AI-generated videos and images from text prompts. Professional-grade cinematic output in seconds.",
  keywords: ["AI video generation", "AI image generation", "creative AI", "text to video", "text to image"],
  openGraph: {
    title: "Forge — AI Creative Studio",
    description: "Create stunning AI-generated videos and images from text prompts.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#080808",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ colorScheme: 'dark' }}>
      <body>{children}</body>
    </html>
  );
}
