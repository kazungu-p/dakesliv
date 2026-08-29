import type { Metadata } from "next";
import "./globals.css";

// Fonts are loaded via <link> in <head> below (see note in README) rather
// than next/font, so the build never depends on reaching Google's font
// endpoint. Swap to next/font/google once you have normal network access —
// it's a drop-in change and gives slightly better loading performance.

export const metadata: Metadata = {
  title: "DAKESLIV Group Ltd | Grooming, Events, Security & Digital",
  description:
    "One trusted DAKESLIV account for grooming & wellness, catering & events, VIP security, and digital services. Book, pay, and get confirmed in minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
