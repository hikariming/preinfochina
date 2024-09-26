import localFont from "next/font/local";
import "../globals.css";
import { Analytics } from "@vercel/analytics/react";
import Head from "next/head";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Chinese Performance Events - Find Shows in China | Event Information",
  description: "Discover the latest Chinese performance events and shows. Find information on concerts, theater, and cultural performances across China.",
};



export default function RootLayout({ children, params: { lang } }) {
  return (
    <html lang={lang}>
      <Head>
        <meta name="keywords" content="Chinese performances, events in China, concerts, theater, cultural shows" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Chinese Performance Events",
              "description": "Find information on concerts, theater, and cultural performances across China."
            }
          `}
        </script>
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
