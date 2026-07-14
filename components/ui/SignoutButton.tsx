"use client";
import { authClient } from '@/lib/auth-client';
// import { redirect } from 'next/navigation';

const SignoutButton = () => {

    async function handleSignout() {
        await authClient.signOut(
            {
                fetchOptions: {
                    onSuccess: () => {
                        // redirect('/');
                        window.location.reload();
                    },
                },
            });
    }
    return (
        <div>
            <button onClick={handleSignout}>Signout</button>
        </div>
    )
}

export default SignoutButton