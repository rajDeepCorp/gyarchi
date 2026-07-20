// app/(main)/[username]/page.tsx

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth, db } from "@/lib/auth";
import { headers } from "next/headers";
import { adminDb } from "@/firebaseAdmin";
import Image from "next/image";
import UserPosts from "@/components/ui/UserPosts";
import Followers from "@/components/ui/Followers";
import { UserSocialLinks } from "@/components/ui/UserSocialLinks";
import { PiCakeThin } from "react-icons/pi";
import { VscVerified } from "react-icons/vsc";

type Props = {
  params: Promise<{
    username: string;
  }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { username } = await params;

  const decodedUsername = decodeURIComponent(username);

  const cleanUsername = decodedUsername.startsWith("@")
    ? decodedUsername
    : `@${decodedUsername}`;

  const user = await db.collection("user").findOne({
    username: cleanUsername,
  });

  if (!user) {
    return {
      title: "User Not Found | GyArchi",
      description: "The requested profile could not be found.",
    };
  }

  const title = `${user.name} (${user.username}) | GyArchi`;

  const description =
    user.bio?.trim() ||
    `${user.name} on GyArchi • ${user.followers ?? 0} followers • ${
      user.following ?? 0
    } following`;

  return {
    title,
    description,

    keywords: [
      user.name,
      user.username,
      "GyArchi",
      "Artist",
      "Creator",
      "Portfolio",
      "Artwork",
      "Profile",
    ],

    openGraph: {
      title,
      description,
      type: "profile",
      url: `https://gyarchi.vercel.app/${encodeURIComponent(
        user.username.replace("@", "")
      )}`,
      images: [
        {
          url: user.image || "/userpic.jpg",
          width: 1200,
          height: 1200,
          alt: `${user.name} Profile`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [user.image || "/userpic.jpg"],
    },

    alternates: {
      canonical: `https://gyarchi.vercel.app/${encodeURIComponent(
        user.username.replace("@", "")
      )}`,
    },
  };
}

export default async function UserProfile({ params }: Props) {
  const { username } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });


  const decodedUsername = decodeURIComponent(username);

  const cleanUsername = decodedUsername.startsWith("@")
    ? decodedUsername
    : `@${decodedUsername}`;

  const user = await db.collection("user").findOne({
    username: cleanUsername,
  });

  if (!user) {
    notFound();
  }

  const postsSnapshot = await adminDb.ref("posts").get();

  let posts: any[] = [];

  if (postsSnapshot.exists()) {
    const data = postsSnapshot.val();

    posts = Object.entries(data)
      .map(([id, post]: any) => ({
        id,
        ...post,
      }))
      .filter((post: any) => post.username === cleanUsername)
      .sort((a: any, b: any) => b.createdAt - a.createdAt);
  }

  return (
    <div className="w-full flex flex-col justify-start items-center overflow-hidden">
      <div className="relative rounded-2xl flex flex-col justify-center items-center">
        <div className="relative w-37.5 h-37.5 rounded-full shadow shadow-stone-500 overflow-hidden">
          <Image
            src={user.image || "/userpic.jpg"}
            alt={user.name}
            fill
            className="object-cover"
            sizes="150px"
          />
        </div>

        <p className="relative text-xl tracking-widest text-shadow-stone-500 text-shadow-xs opacity-90 fancyFont">
          {user.name}
        </p>

        <p className="relative max-w-fit text-center flex justify-start items-center text-md italic tracking-tighter leading-2 text-shadow-stone-500 text-shadow-xs">
          {user.username || "Guest"}

          {user.username?.trim() && user.emailVerified && (
            <span className="relative -translate-y-1/3">
              <VscVerified />
            </span>
          )}
        </p>

        <p className="relative text-xs w-full text-shadow-stone-500 text-shadow-xs flex justify-start items-center gap-1 mt-1">
          <PiCakeThin />
          {user.dob
            ? new Date(user.dob).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
            })
            : "No DOB"}
        </p>

        <p className="relative text-sm w-full text-shadow-stone-500 text-shadow-xs">
          {user.bio || null}
        </p>

        <p className="relative text-sm w-full font-light opacity-90 italic text-shadow-stone-500 text-shadow-xs">
          {user.address || null}
        </p>
      </div>

      <Followers
        followers={user.followers ?? 0}
        following={user.following ?? 0}
        username={user.username}
      />

      <div className="relative w-full max-w-xs flex flex-col justify-center items-center mt-4 gap-2">
        <p className="relative w-full text-center text-lg underline text-shadow-xs text-shadow-stone-500 fancyFont italic shadow shadow-stone-500 rounded-t-full">
          Links
        </p>

        <UserSocialLinks user={user} />
      </div>

      <div className="relative w-full flex flex-col justify-center items-center mt-4 gap-2">
        <p className="relative w-full max-w-2xl text-center text-lg underline text-shadow-xs text-shadow-stone-500 fancyFont italic shadow shadow-stone-500 rounded-t-full">
          Artwork
        </p>

        <UserPosts posts={posts} />
      </div>
    </div>
  );
}