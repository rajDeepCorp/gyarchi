// app/(main)/layout.tsx

import Navbar from "@/components/navigation/Navbar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function UserLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    const session = await auth.api.getSession({ headers: await headers(), });

    if (!session) {
        redirect('/signin');
      }

    const user = session?.user ?? null;

    return (
        <main className="relative">
            {children}
            <Navbar />
        </main>
    );
}
