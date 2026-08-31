import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://oncollably.com";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "OnCollably | The #1 Web3 Collaboration Management Platform",
    template: "%s | OnCollably",
  },
  description:
    "Stop doing Web3 collabs in messy DMs. OnCollably is the ultimate platform for Web3 communities, DAOs, and Collab Managers to automate whitelist spot allocation, verify CMs, and manage applications in one place.",
  keywords: [
    "Web3 collaborations",
    "Collab Manager",
    "NFT whitelist management",
    "DAO partnerships",
    "CM verification",
    "Web3 community management",
    "Whitelist spot allocation",
    "OnCollably",
  ],
  authors: [{ name: "OnCollably Team" }],
  creator: "OnCollably",
  publisher: "OnCollably",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: appUrl,
    title: "OnCollably | Stop Doing Web3 Collabs in DMs",
    description:
      "Manage collaboration applications, verify community managers, allocate whitelist spots, and track every Web3 collaboration in one unified dashboard.",
    siteName: "OnCollably",
  },
  twitter: {
    card: "summary_large_image",
    title: "OnCollably | The #1 Web3 Collaboration Management Platform",
    description:
      "Stop doing Web3 collabs in messy DMs. Automate whitelist spot allocations, verify CMs, and track applications in one place.",
    creator: "@oncollably",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} h-full antialiased font-sans`}
    >
      <body className="min-h-full flex flex-col font-sans bg-white text-zinc-900">
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}

