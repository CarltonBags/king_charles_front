import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Londoner - Drink Guide",
  description: "Your personal drinking guide at The Londoner pub",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
