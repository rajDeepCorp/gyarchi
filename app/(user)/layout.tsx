// app/(main)/layout.tsx

import Navbar from "@/components/navigation/Navbar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function UserLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    const session = await auth.api.getSession({ headers: await headers(), });

    const user = session?.user ?? null;
    
    return (
        <main className="relative">
            {children}
            <Navbar />
        </main>
    );
}
