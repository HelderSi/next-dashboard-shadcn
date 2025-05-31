import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryClientWrapper from "@/components/query-client-wrapper";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const title = "Dashboard NR Digital";
const description = "Dashboard NR Digital - Dashboard para gestão de NRs";

export const metadata: Metadata = {
  title,
  description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt_BR">
      <head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={title} />
        <meta name="application-name" content={title} />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/icons/icon-192.png" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@your_twitter_handle" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="/icons/icon-192.png" />
        <meta name="twitter:image:alt" content={title} />
        <meta name="og:title" content={title} />
        <meta name="og:description" content={description} />
        <meta name="og:image" content="/icons/icon-192.png" />
        {/* <meta name="og:url" content="https://yourwebsite.com" /> */}
        <meta name="og:type" content="website" />
        <meta name="og:site_name" content={title} />
        <meta name="og:locale" content="pt_BR" />
        <meta name="og:site_name" content={title} />
        <meta name="og:description" content={description} />
        <meta name="og:image:width" content="1920" />
        <meta name="og:image:height" content="1080" />
        <meta name="og:image:type" content="image/png" />
        <meta name="og:image:alt" content={title} />
        {/* <meta name="og:image:secure_url" content="https://yourwebsite.com/icons/icon-192.png" /> */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryClientWrapper>
          {children}
        </QueryClientWrapper>
        <Toaster />
      </body>
    </html>
  );
}
