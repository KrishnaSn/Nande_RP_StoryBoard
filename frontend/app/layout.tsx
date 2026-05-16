import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nande RP StoryBoard",
  description: "A professional cinematic story engine created for the private Nande RP community to plan, document, and sequence their roleplay stories.",
  icons: {
    icon: [
      { url: "/logo.jpg?v=1", sizes: "32x32", type: "image/jpeg" },
      { url: "/logo.jpg?v=1", sizes: "16x16", type: "image/jpeg" },
    ],
    shortcut: "/logo.jpg?v=1",
    apple: "/logo.jpg?v=1",
  },
  openGraph: {
    title: "Nande RP StoryBoard",
    description: "Documenting the legends of Nande RP. A private cinematic workflow for storytellers.",
    images: ["/logo.jpg?v=1"],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
