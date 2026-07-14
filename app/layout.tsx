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
  title: "GyaRchi | New definition of Social Media",
  description: "Created by Vishal Rajdeep",
};

export default async function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  const session = await auth.api.getSession({ headers: await headers(), });

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${poppinsFont.variable} ${varelaRoundFont.variable} h-full antialiased`}
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
