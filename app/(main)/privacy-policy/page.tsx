// app/(main)/privacy-policy/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read the Privacy Policy of GyArchi to understand how we collect, use, store, and protect your information while using our platform.",

  keywords: [
    "GyArchi Privacy Policy",
    "Privacy Policy",
    "User Privacy",
    "Data Protection",
    "Information Collection",
    "Cookies",
    "Personal Information",
    "Account Security",
    "GDPR",
    "Privacy",
  ],

  openGraph: {
    title: "Privacy Policy | GyArchi",
    description:
      "Learn how GyArchi collects, uses, and protects your personal information.",
    url: "https://gyarchi.com/privacy-policy",
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
    title: "Privacy Policy | GyArchi",
    description:
      "Read the Privacy Policy for using the GyArchi platform.",
    images: ["/Logo.png"],
  },

  alternates: {
    canonical: "/privacy-policy",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="mb-4 max-w-xl mx-auto">

      <header className="w-full shadow shadow-stone-500 rounded-2xl p-3 mt-2 mb-4">
        <h1 className="text-4xl text-center text-shadow-stone-500 text-shadow-md my-2">
          Privacy Policy
        </h1>

        <p className="mt-5 text-sm italic opacity-90">
          Your privacy is important to us. This Privacy Policy explains how
          GyArchi collects, uses, stores, and protects your information when
          you use our platform.
        </p>

        <p className="mt-5 text-md font-medium">
          By using GyArchi, you agree to this Privacy Policy.
        </p>
      </header>

      <section
        aria-labelledby="information"
        className="shadow shadow-stone-500 rounded-2xl p-3 mb-4"
      >
        <h2
          id="information"
          className="text-2xl text-shadow-stone-500 text-shadow-sm font-semibold"
        >
          Information We Collect
        </h2>

        <ul className="list-disc pl-6 mt-4 space-y-2 text-sm leading-7 opacity-90">
          <li>Name and profile information</li>
          <li>Email address</li>
          <li>Date of birth (if provided)</li>
          <li>Profile picture</li>
          <li>Artwork, images, and videos you upload</li>
          <li>Likes, saves, follows, and other activity</li>
          <li>Device and browser information</li>
        </ul>
      </section>

      <section
        aria-labelledby="usage"
        className="shadow shadow-stone-500 rounded-2xl p-3 mb-4"
      >
        <h2
          id="usage"
          className="text-2xl text-shadow-stone-500 text-shadow-sm font-semibold"
        >
          How We Use Your Information
        </h2>

        <ul className="list-disc pl-6 mt-4 space-y-2 text-sm leading-7 opacity-90">
          <li>Create and manage your account</li>
          <li>Display your profile and artwork</li>
          <li>Provide social features such as likes and follows</li>
          <li>Improve platform performance and user experience</li>
          <li>Prevent abuse, fraud, and unauthorized activity</li>
          <li>Communicate important service updates</li>
        </ul>
      </section>

      <section
        aria-labelledby="content"
        className="shadow shadow-stone-500 rounded-2xl p-3 mb-4"
      >
        <h2
          id="content"
          className="text-2xl text-shadow-stone-500 text-shadow-sm font-semibold"
        >
          Your Content
        </h2>

        <p className="mt-4 text-sm leading-7 opacity-90">
          You retain ownership of the artwork and other content you upload.
          However, by posting content on GyArchi, you grant us permission to
          display and distribute it within the platform so other users can view
          and interact with it.
        </p>
      </section>

      <section
        aria-labelledby="sharing"
        className="shadow shadow-stone-500 rounded-2xl p-3 mb-4"
      >
        <h2
          id="sharing"
          className="text-2xl text-shadow-stone-500 text-shadow-sm font-semibold"
        >
          Information Sharing
        </h2>

        <p className="mt-4 text-sm leading-7 opacity-90">
          We do not sell your personal information. Information may only be
          shared when required by law, to protect our platform, or when
          necessary to provide our services.
        </p>
      </section>

      <section
        aria-labelledby="security"
        className="shadow shadow-stone-500 rounded-2xl p-3 mb-4"
      >
        <h2
          id="security"
          className="text-2xl text-shadow-stone-500 text-shadow-sm font-semibold"
        >
          Data Security
        </h2>

        <p className="mt-4 text-sm leading-7 opacity-90">
          We take reasonable measures to protect your information from
          unauthorized access, loss, misuse, or disclosure. However, no online
          platform can guarantee absolute security.
        </p>
      </section>

      <section
        aria-labelledby="cookies"
        className="shadow shadow-stone-500 rounded-2xl p-3 mb-4"
      >
        <h2
          id="cookies"
          className="text-2xl text-shadow-stone-500 text-shadow-sm font-semibold"
        >
          Cookies & Analytics
        </h2>

        <p className="mt-4 text-sm leading-7 opacity-90">
          GyArchi may use cookies or similar technologies to improve
          functionality, remember user preferences, and analyze platform usage.
        </p>
      </section>

      <section
        aria-labelledby="rights"
        className="shadow shadow-stone-500 rounded-2xl p-3 mb-4"
      >
        <h2
          id="rights"
          className="text-2xl text-shadow-stone-500 text-shadow-sm font-semibold"
        >
          Your Rights
        </h2>

        <ul className="list-disc pl-6 mt-4 space-y-2 text-sm leading-7 opacity-90">
          <li>Access your account information</li>
          <li>Update your profile details</li>
          <li>Delete your account where available</li>
          <li>Request correction of inaccurate information</li>
        </ul>
      </section>

      <section
        aria-labelledby="children"
        className="shadow shadow-stone-500 rounded-2xl p-3 mb-4"
      >
        <h2
          id="children"
          className="text-2xl text-shadow-stone-500 text-shadow-sm font-semibold"
        >
          Children's Privacy
        </h2>

        <p className="mt-4 text-sm leading-7 opacity-90">
          GyArchi is not intended for children under the age required by
          applicable laws. We do not knowingly collect personal information from
          children.
        </p>
      </section>

      <section
        aria-labelledby="changes"
        className="shadow shadow-stone-500 rounded-2xl p-3 mb-4"
      >
        <h2
          id="changes"
          className="text-2xl text-shadow-stone-500 text-shadow-sm font-semibold"
        >
          Changes to This Policy
        </h2>

        <p className="mt-4 text-sm leading-7 opacity-90">
          We may update this Privacy Policy from time to time. Continued use of
          GyArchi after changes become effective means you accept the updated
          policy.
        </p>
      </section>

      <footer className="shadow shadow-stone-500 rounded-2xl p-3 mb-4">
        <h2 className="text-2xl text-shadow-stone-500 text-shadow-sm font-semibold">
          Contact
        </h2>

        <p className="mt-4 text-sm leading-7 opacity-90">
          If you have any questions regarding this Privacy Policy, please
          contact the GyArchi team.
        </p>

        <p className="mt-4 text-sm italic opacity-90">
          Thank you for trusting GyArchi.
        </p>
      </footer>

    </main>
  );
}