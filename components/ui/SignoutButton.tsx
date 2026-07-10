"use client";
import React from 'react'
import { authClient } from '@/lib/auth-client';
import { redirect } from 'next/navigation';

const SignoutButton = () => {

    async function handleSignout() {
        await authClient.signOut(
            {
                fetchOptions: {
                    onSuccess: () => {
                        redirect('/');
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