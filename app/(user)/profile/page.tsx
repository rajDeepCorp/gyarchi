// app/(user)/profile/page.tsx

import UserPosts from '@/components/ui/UserPosts'
import { UserSocialLinks } from '@/components/ui/UserSocialLinks'
import { adminDb } from '@/firebaseAdmin'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { PiCakeThin } from 'react-icons/pi'
import { VscVerified } from 'react-icons/vsc'

export default async function Profile() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/signin');
  }

  const snapshot = await adminDb.ref("posts").get();

  let posts: any[] = [];

  if (snapshot.exists()) {
    const data = snapshot.val();

    posts = Object.entries(data)
      .map(([id, post]: any) => ({
        id,
        ...post,
      }))
      .filter(
        (post: any) =>
          post.username === session.user.username
      )
      .sort(
        (a: any, b: any) =>
          b.createdAt - a.createdAt
      );
  }

  return (
    <div className='w-full flex flex-col justify-start items-center overflow-hidden'>

      <div className='relative rounded-2xl flex flex-col justify-center items-center'>
        <div className='relative w-37.5 h-37.5 rounded-full shadow shadow-stone-500 overflow-hidden '>
          <Image src={session.user.image || "/userpic.jpg"} alt={session.user.name} fill className="object-cover" sizes="150px" />
        </div>
        <p className='relative text-xl tracking-widest text-shadow-stone-500 text-shadow-xs opacity-90 fancyFont'>{session.user.name}</p>
        <p className='relative max-w-fit text-center flex justify-start items-center text-md italic tracking-tighter leading-2 text-shadow-stone-500 text-shadow-xs'>
          {session.user.username || "Guest"}
          {session.user.username?.trim() && session.user.emailVerified && (
            <span className="relative -translate-y-1/3">
              <VscVerified />
            </span>
          )}
        </p>
        <p className='relative text-xs w-full text-shadow-stone-500 text-shadow-xs flex justify-start items-center gap-1 mt-1'>
          <PiCakeThin /> {session.user.dob
            ? new Date(session.user.dob).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
            })
            : "No DOB"}
        </p>
        <p className='relative text-sm w-full text-shadow-stone-500 text-shadow-xs'>
          {session.user.bio || null}
        </p>
        <p className='relative text-sm w-full font-light opacity-90 italic text-shadow-stone-500 text-shadow-xs'>
          {session.user.address || null}
        </p>
      </div>

      <div className='relative w-full max-w-2xl flex justify-around items-center mt-4'>
        <button className='relative text-xs translate-x-[-25%] rounded-l-2xl px-2 shadow py-1 shadow-stone-500 flex justify-center items-center'>
          Followers
          <span className='absolute right-0 px-1 translate-x-[105%] shadow py-1 shadow-stone-500 text-xs rounded-r-2xl'>
            999
          </span>
        </button>

        <button className='relative text-xs translate-x-[-25%] rounded-l-2xl px-2 shadow py-1 shadow-stone-500 flex justify-center items-center'>
          Following
          <span className='absolute right-0 px-1 translate-x-[105%] shadow py-1 shadow-stone-500 text-xs rounded-r-2xl'>
            999
          </span>
        </button>

        <button className='relative text-xs translate-x-[-25%] rounded-l-2xl px-2 shadow py-1 shadow-stone-500 flex justify-center items-center'>
          Clients
          <span className='absolute right-0 px-1 translate-x-[105%] shadow py-1 shadow-stone-500 text-xs rounded-r-2xl'>
            999
          </span>
        </button>
      </div>

      <div className='relative w-full max-w-xs flex flex-col justify-center items-center mt-4 gap-2'>
        <p className='relative w-full text-center text-lg underline text-shadow-xs text-shadow-stone-500 fancyFont italic shadow shadow-stone-500 rounded-t-full'>Links</p>
        <UserSocialLinks user={session.user} />
      </div>

      <div className='relative w-full flex flex-col justify-center items-center mt-4 gap-2'>
        <p className='relative w-full max-w-2xl text-center text-lg underline text-shadow-xs text-shadow-stone-500 fancyFont italic shadow shadow-stone-500 rounded-t-full'>Artwork</p>
        {session.user.username && <UserPosts posts={posts} />}
      </div>

    </div>
  )
}
