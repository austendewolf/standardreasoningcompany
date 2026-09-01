import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "The Standard Reasoning Company",
  description:
    "An independent holding company. Currently building Praetom and Antevant.",
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%230b0c0d"/><rect x="8" y="8" width="84" height="84" fill="none" stroke="%23edeff1" stroke-width="5"/><rect x="30" y="30" width="40" height="40" fill="%23edeff1"/></svg>',
  },
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
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
