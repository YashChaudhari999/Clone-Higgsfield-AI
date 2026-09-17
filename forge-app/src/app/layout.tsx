import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Forgefield — AI Creative Suite",
  description: "Create stunning AI-generated videos, motion transfers, and 4K images with sub-second consistency.",
  keywords: ["AI video generation", "AI image generation", "Genjutsu", "Seedance", "VFX engine", "Forgefield AI"],
  openGraph: {
    title: "Forgefield — AI Creative Suite",
    description: "Explore the world's most advanced AI creative engine.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#090B0C",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ colorScheme: 'dark' }}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
