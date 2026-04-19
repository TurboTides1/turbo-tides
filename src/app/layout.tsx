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
    "Private swim lessons for young swimmers in Danville, CA. Learn all four strokes, dives, turns, and fundamentals with experienced instructors Kayla and Jack. $25 per 20-minute lesson at Glenview Swim Club.",
  metadataBase: new URL("https://turbotides.us"),
  openGraph: {
    title: "Turbo Tides | Swim Lessons in Danville, CA",
    description:
      "Private swim lessons for young swimmers. Learn strokes, dives, turns & fundamentals. $25/lesson at Glenview Swim Club.",
    url: "https://turbotides.us",
    siteName: "Turbo Tides",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Turbo Tides | Swim Lessons in Danville, CA",
    description:
      "Private swim lessons for young swimmers. Learn strokes, dives, turns & fundamentals. $25/lesson at Glenview Swim Club.",
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
