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
  openGraph: {
    title: "Nande RP StoryBoard",
    description: "Documenting the legends of Nande RP. A private cinematic workflow for storytellers.",
    images: ["/image.png"], // Reference the existing image if possible
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
