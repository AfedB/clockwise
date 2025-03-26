import { Chivo_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const chivoMono = Chivo_Mono({
  subsets: ["latin"],
  display: "swap",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata = {
  title: "Digital Clock | Modern Customizable Web Clock",
  description:
    "A modern digital clock with customizable themes, timezones, alarms and 12/24h format options. Perfect for everyday use.",
  keywords: "digital clock, web clock, time, alarm clock, customizable clock",
  authors: [{ name: "Your Name", url: "https://yourwebsite.com" }],
  robots: "index, follow",
  openGraph: {
    title: "Digital Clock | Modern Customizable Web Clock",
    description:
      "A modern digital clock with customizable themes, timezones, and more",
    url: "https://your-domain.com",
    siteName: "Digital Clock App",
    images: [
      {
        url: "https://your-domain.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Digital Clock Preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Clock App",
    description: "A modern digital clock with customizable features",
    images: ["https://your-domain.com/twitter-image.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4837266905158444"
          crossorigin="anonymous"
        ></script>
        <meta name="google-adsense-account" content="ca-pub-4837266905158444"></meta>
      </head>
      <body className={chivoMono.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
