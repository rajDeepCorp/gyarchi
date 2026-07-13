// app/(user)/settings/page.tsx

import FacePic from '@/components/settings/FacePic';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Settings() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/signin');
  }

  return (
    <div className='w-full flex flex-col justify-start items-center overflow-hidden gap-5'>
      <p className='text-2xl tracking-widest text-shadow-sm text-shadow-stone-500'>Settings</p>

      <FacePic user={session.user} />

      

    </div>
  )
}
