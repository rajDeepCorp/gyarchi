import type { Metadata } from "next";
import { Poppins, Varela_Round } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

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
  title: "GyaRchi | New definition of Social Media",
  description: "Created by Vishal Rajdeep",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${poppinsFont.variable} ${varelaRoundFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col shadow-inner shadow-stone-500 m-1 p-2 rounded-2xl">
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
