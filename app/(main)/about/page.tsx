// app/(main)/about/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about GyArchi, a social platform built for artists, designers, photographers, tattoo artists, and creators to showcase their work, build portfolios, and connect with a global creative community.",

  keywords: [
    "About GyArchi",
    "GyArchi",
    "Artists",
    "Creative Community",
    "Art Platform",
    "Portfolio",
    "Digital Artists",
    "Tattoo Artists",
    "Photography",
    "Illustration",
    "Graphic Design",
    "Creators",
    "Social Platform",
    "Artwork Sharing",
  ],

  openGraph: {
    title: "About GyArchi",
    description:
      "Discover the vision, mission, and purpose behind GyArchi—a social platform designed for artists and creators.",
    url: "https://www.gyarchi.com/about",
    type: "website",
    images: [
      {
        url: "/Logo.png",
        width: 1200,
        height: 630,
        alt: "GyArchi",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "About GyArchi",
    description:
      "Learn about GyArchi and our mission to empower artists worldwide.",
    images: ["/Logo.png"],
  },

  alternates: {
    canonical: "/about",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function AboutPage() {
  return (
    <main className="mb-4 max-w-xl mx-auto">

      <header className="w-full shadow shadow-stone-500 rounded-2xl p-3 mt-2 mb-4">
        <h1 className="text-4xl text-center text-shadow-stone-500 text-shadow-md my-2">
          About GyArchi
        </h1>

        <p className="mt-5 text-sm italic opacity-90">
          GyArchi is a social platform built for artists, designers,
          photographers, tattoo artists, illustrators, and creators from around
          the world.
        </p>

        <p className="mt-5 text-md font-medium">
          Our mission is simple:
        </p>

        <blockquote className="mt-2 border-l-4 border-stone-500 pl-4 italic opacity-90">
          Give every creator a place where their creativity is seen,
          appreciated, and remembered.
        </blockquote>
      </header>

      <section
        aria-labelledby="vision"
        className="shadow shadow-stone-500 rounded-2xl p-3 mb-4"
      >
        <h2
          id="vision"
          className="text-2xl text-shadow-stone-500 text-shadow-sm font-semibold"
        >
          Our Vision
        </h2>

        <p className="mt-4 text-sm leading-7 opacity-90">
          We believe creativity has no boundaries. GyArchi exists to help creators
          showcase their work, build a portfolio, connect with other artists, gain
          followers, and inspire people worldwide.
        </p>
      </section>

      <section
        aria-labelledby="features"
        className="shadow shadow-stone-500 rounded-2xl p-3 mb-4"
      >
        <h2
          id="features"
          className="text-2xl text-shadow-stone-500 text-shadow-sm font-semibold"
        >
          What You Can Do
        </h2>

        <ul className="list-disc pl-6 mt-4 space-y-2 text-sm leading-7 opacity-90">
          <li>Share your artwork</li>
          <li>Create your creative portfolio</li>
          <li>Explore artwork from creators worldwide</li>
          <li>Like and save inspiring artwork</li>
          <li>Follow your favorite artists</li>
          <li>Connect with the creative community</li>
          <li>Discover new styles and inspiration</li>
        </ul>
      </section>

      <section
        aria-labelledby="audience"
        className="shadow shadow-stone-500 rounded-2xl p-3 mb-4"
      >
        <h2
          id="audience"
          className="text-2xl text-shadow-stone-500 text-shadow-sm font-semibold"
        >
          Who Is GyArchi For?
        </h2>

        <p className="mt-4 text-sm opacity-90">
          GyArchi welcomes every creative individual including:
        </p>

        <ul className="list-disc pl-6 mt-4 space-y-2 text-sm leading-7 opacity-90">
          <li>Digital Artists</li>
          <li>Tattoo Artists</li>
          <li>Illustrators</li>
          <li>Photographers</li>
          <li>Painters</li>
          <li>Sketch Artists</li>
          <li>Graphic Designers</li>
          <li>UI/UX Designers</li>
          <li>3D Artists</li>
          <li>Creative Students</li>
          <li>Art Enthusiasts</li>
        </ul>
      </section>

      <section
        aria-labelledby="why"
        className="shadow shadow-stone-500 rounded-2xl p-3 mb-4"
      >
        <h2
          id="why"
          className="text-2xl text-shadow-stone-500 text-shadow-sm font-semibold"
        >
          Why We Built GyArchi
        </h2>

        <p className="mt-4 text-sm leading-7 opacity-90">
          Traditional social media platforms are designed for everyone. GyArchi is
          built specifically for creators, giving artwork the attention it deserves
          without getting lost in endless entertainment.
        </p>

        <p className="mt-4 text-sm leading-7 opacity-90">
          Our goal is to help artists build a meaningful online presence and receive
          recognition for their creativity.
        </p>
      </section>

      <section
        aria-labelledby="mission"
        className="shadow shadow-stone-500 rounded-2xl p-3 mb-4"
      >
        <h2
          id="mission"
          className="text-2xl text-shadow-stone-500 text-shadow-sm font-semibold"
        >
          Our Mission
        </h2>

        <p className="mt-4 text-sm leading-7 opacity-90">
          To empower artists by providing a platform where creativity is valued,
          portfolios are built, communities grow, and opportunities are created.
        </p>
      </section>

      <section
        aria-labelledby="values"
        className="shadow shadow-stone-500 rounded-2xl p-3 mb-4"
      >
        <h2
          id="values"
          className="text-2xl text-shadow-stone-500 text-shadow-sm font-semibold mb-4"
        >
          Our Values
        </h2>

        <article className="mb-5">
          <h3 className="text-lg font-semibold">Creativity First</h3>
          <p className="mt-2 text-sm leading-7 opacity-90">
            Every creator deserves recognition and appreciation.
          </p>
        </article>

        <article className="mb-5">
          <h3 className="text-lg font-semibold">Community</h3>
          <p className="mt-2 text-sm leading-7 opacity-90">
            Support, collaboration, and inspiration make creativity stronger.
          </p>
        </article>

        <article className="mb-5">
          <h3 className="text-lg font-semibold">Originality</h3>
          <p className="mt-2 text-sm leading-7 opacity-90">
            We encourage authentic artwork while respecting intellectual property.
          </p>
        </article>

        <article>
          <h3 className="text-lg font-semibold">Growth</h3>
          <p className="mt-2 text-sm leading-7 opacity-90">
            Helping creators improve their skills, reach more people, and build
            lasting careers.
          </p>
        </article>
      </section>

      <section
        aria-labelledby="join"
        className="shadow shadow-stone-500 rounded-2xl p-3 mb-4"
      >
        <h2
          id="join"
          className="text-2xl text-shadow-stone-500 text-shadow-sm font-semibold"
        >
          Join the Creative Community
        </h2>

        <p className="mt-4 text-sm leading-7 opacity-90">
          Whether you're sharing your first sketch or your latest masterpiece,
          GyArchi welcomes you.
        </p>

        <p className="mt-4 text-lg font-semibold italic">
          Create. Share. Inspire. Grow.
        </p>
      </section>

      <footer className="shadow shadow-stone-500 rounded-2xl p-3 mb-4">
        <h2 className="text-2xl text-shadow-stone-500 text-shadow-sm font-semibold">
          Created By
        </h2>

        <p className="mt-4 text-sm leading-7 opacity-90">
          GyArchi was created by <strong>Vishal Rajdeep</strong> with the vision of
          building a dedicated social platform where artists and creators can
          showcase their talent, connect with the creative community, and grow
          together.
        </p>

        <p className="mt-4 text-sm italic opacity-90">
          Thank you for being a part of GyArchi.
        </p>
      </footer>

    </main>
  );
}