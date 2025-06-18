import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
});
export const metadata: Metadata = {
  icons: {
    icon: "/favicon2.png",
  },
  title:
    "SEA Catering® | Healthy Meal Plans Delivered Across Indonesia – “Healthy Meals, Anytime, Anywhere”",
  description:
    "SEA Catering | Fresh, healthy meals delivered nationwide in Indonesia. Customize your plan and enjoy nutritious food, anytime, anywhere. New customers start today!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfairDisplay.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
