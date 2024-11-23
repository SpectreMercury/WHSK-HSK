import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    template: '%s | HSK Swap',
    default: 'HSK Swap - Wrap and Unwrap HSK Token',
  },
  description: 'Easily wrap and unwrap your HSK tokens. A secure and efficient way to convert between HSK and WHSK.',
  keywords: ['HSK', 'WHSK', 'Swap', 'Wrap', 'Unwrap', 'Token', 'DeFi'],
  authors: [{ name: 'HSK Team' }],
  openGraph: {
    title: 'HSK Swap',
    description: 'Easily wrap and unwrap your HSK tokens',
    images: [{
      url: 'https://hyper-index-dex.4everland.store/hsk-logo.png',
      width: 800,
      height: 600,
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HSK Swap',
    description: 'Easily wrap and unwrap your HSK tokens',
    images: ['https://hyper-index-dex.4everland.store/hsk-logo.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
