import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "Forgefield — Creative Project Workspace",
  description: "Forgefield is a cloud-based creative workspace where creators turn ideas into organized projects, manage creative briefs and assets, and discover visual inspiration.",
  keywords: ["creative workspace", "project management", "creative briefs", "asset management", "inspiration", "Forgefield"],
  openGraph: {
    title: "Forgefield — Creative Project Workspace",
    description: "Organize creative briefs, reference assets, and project direction in one focused workspace.",
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
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
