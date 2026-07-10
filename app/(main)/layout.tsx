// app/(main)/layout.tsx

import Navbar from "@/components/navigation/Navbar";

export default function MainLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {

    return (
        <main className="relative">
            {children}
            <Navbar />
        </main>
    );
}
