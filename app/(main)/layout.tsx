// import type { Metadata } from "next";

import Navbar from "@/components/navigation/Navbar";

// export const metadata: Metadata = {
//   title: "GyaRchi | New definition of Social Media",
//   description: "Created by Vishal Rajdeep",
// };

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main className="relative shadow-inner shadow-stone-500 m-2 p-2 rounded-2xl">
            {children}
            <Navbar />
        </main>
    );
}
