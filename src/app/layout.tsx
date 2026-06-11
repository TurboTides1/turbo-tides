import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Turbo Tides | Swim Lessons in Danville, CA",
    template: "%s | Turbo Tides",
  },
  description:
    "Private swim lessons for young swimmers in the Greenbrook and Sycamore neighborhoods of Danville, CA. Learn all four strokes, dives, turns, and fundamentals with experienced instructors Kayla and Jack. $30 per 20-minute lesson.",
  metadataBase: new URL("https://turbotides.us"),
  openGraph: {
    title: "Turbo Tides | Swim Lessons in Danville, CA",
    description:
      "Private swim lessons in Danville, CA. Learn strokes, dives, turns & fundamentals. $30 per 20-minute lesson.",
    url: "https://turbotides.us",
    siteName: "Turbo Tides",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Turbo Tides | Swim Lessons in Danville, CA",
    description:
      "Private swim lessons in Danville, CA. Learn strokes, dives, turns & fundamentals. $30 per 20-minute lesson.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
