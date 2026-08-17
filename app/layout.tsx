import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "@fontsource/rozha-one/400.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: "Nusrat, All Night — NFAK After Dark",
  description:
    "A wall of memory. An all-night Nusrat Fateh Ali Khan listening experience.",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "Nusrat, All Night",
    description:
      "A wall of memory. An all-night Nusrat Fateh Ali Khan listening experience.",
    type: "website",
    images: [
      { url: "/og.png", width: 1200, height: 630, alt: "Nusrat, All Night" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nusrat, All Night",
    description:
      "A wall of memory. An all-night Nusrat Fateh Ali Khan listening experience.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={GeistSans.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
