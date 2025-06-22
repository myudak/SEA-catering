import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Navbar } from "@/components/navbar";
import { ViewTransitions } from "next-view-transitions";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";

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
    <ViewTransitions>
      <html lang="en" suppressHydrationWarning>
        <body className={`${playfairDisplay.className} antialiased`}>
          <AuthProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <Navbar />
              {children}
              <Footer />
              <Toaster />
            </ThemeProvider>
          </AuthProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
