import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Londoner - Drink Guide",
  description: "Your personal drinking guide at The Londoner pub",
  icons: {
    icon: "/images/FAVICON.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Jersey+10&display=swap"
          rel="stylesheet"
        />
        <link rel="preload" as="image" href="/images/PUB_VIEW.png" />
        <link rel="preload" as="image" href="/images/DRINK_GUIDE_OPEN.png" />
        <link rel="preload" as="image" href="/images/QUIZ_SPLASH.png" />
        <link rel="preload" as="image" href="/images/SELECTION.png" />
        <link rel="preload" as="image" href="/images/THINKING.png" />
      </head>
      <body className="min-h-dvh">
        {children}
      </body>
    </html>
  );
}
