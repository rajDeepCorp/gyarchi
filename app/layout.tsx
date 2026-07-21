// app/layout.tsx

import type { Metadata } from "next";
import { Poppins, Varela_Round } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import SideNavbar from "@/components/navigation/SideNavbar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";


const poppinsFont = Poppins({
  variable: "--font-poppins-font",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

const varelaRoundFont = Varela_Round({
  variable: "--font-varela-round",
  weight: ["400"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "GyArchi – Share Art, Inspire the World",
    template: "%s | GyArchi",
  },
  description:
    "GyArchi is a social platform for artists, designers, photographers, tattoo artists, and creators to showcase artwork, build a portfolio, connect with people, gain followers, and grow their creative presence.",

  keywords: [
    "GyArchi",
    "Social Media",
    "Artists",
    "Artwork",
    "Creative Community",
    "Tattoo",
    "Tattoo Artists",
    "Digital Art",
    "Photography",
    "Illustration",
    "Portfolio",
    "Creators",
    "Design",
    "Art Sharing",
    "Creative Platform",
  ],

  authors: [
    {
      name: "Vishal Rajdeep",
    },
  ],

  creator: "Vishal Rajdeep",
  publisher: "GyArchi",

  metadataBase: new URL("https://gyarchi.vercel.app/"),

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://gyarchi.vercel.app",
    siteName: "GyArchi",
    title: "GyArchi – Share Art, Inspire the World",
    description:
      "Discover, share, and connect through creativity. Join artists from around the world on GyArchi.",
    images: [
      {
        url: "/Logo.png",
        width: 1200,
        height: 630,
        alt: "GyArchi",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "GyArchi – Share Art, Inspire the World",
    description:
      "A social media platform built for artists and creators to showcase their work and grow their audience.",
    images: ["/Logo.png"],
  },

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/Logo.png",
  },
};

export default async function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  const session = await auth.api.getSession({ headers: await headers(), });

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${poppinsFont.variable} ${varelaRoundFont.variable} h-svh w-svw antialiased`}
    >
      <body className="min-h-full flex flex-col shadow-inner shadow-stone-500 m-1 p-2 rounded-2xl">
        {session && <SideNavbar />}        
        {children}
        <Toaster
          position="top-center"
          richColors
          closeButton
          duration={3000}
        />
      </body>
    </html>
  );
}
