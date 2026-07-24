// app/(main)/terms-and-conditions/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Read the Terms & Conditions for using GyArchi. Learn about user responsibilities, content ownership, prohibited activities, and platform rules.",

  keywords: [
    "GyArchi Terms",
    "Terms and Conditions",
    "Terms of Service",
    "User Agreement",
    "Community Guidelines",
    "Artwork Platform",
    "Artist Community",
    "Content Ownership",
    "User Responsibilities",
    "GyArchi",
  ],

  openGraph: {
    title: "Terms & Conditions | GyArchi",
    description:
      "Read the Terms & Conditions governing the use of the GyArchi platform.",
    url: "https://gyarchi.com/terms-and-conditions",
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
    title: "Terms & Conditions | GyArchi",
    description:
      "Read the Terms & Conditions for using the GyArchi platform.",
    images: ["/Logo.png"],
  },

  alternates: {
    canonical: "/terms-and-conditions",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsAndConditionsPage() {
  return (
    <main className="mb-4 max-w-xl mx-auto">

      <header className="w-full shadow shadow-stone-500 rounded-2xl p-3 mt-2 mb-4">
        <h1 className="text-4xl text-center text-shadow-stone-500 text-shadow-md my-2">
          Terms & Conditions
        </h1>

        <p className="mt-5 text-sm italic opacity-90">
          These Terms & Conditions govern your access to and use of GyArchi. By
          using the platform, you agree to comply with these terms.
        </p>

        <p className="mt-5 text-md font-medium">
          Please read them carefully before using GyArchi.
        </p>
      </header>

      <section
        aria-labelledby="acceptance"
        className="shadow shadow-stone-500 rounded-2xl p-3 mb-4"
      >
        <h2
          id="acceptance"
          className="text-2xl text-shadow-stone-500 text-shadow-sm font-semibold"
        >
          Acceptance of Terms
        </h2>

        <p className="mt-4 text-sm leading-7 opacity-90">
          By creating an account or using GyArchi, you agree to these Terms &
          Conditions and our Privacy Policy.
        </p>
      </section>

      <section
        aria-labelledby="eligibility"
        className="shadow shadow-stone-500 rounded-2xl p-3 mb-4"
      >
        <h2
          id="eligibility"
          className="text-2xl text-shadow-stone-500 text-shadow-sm font-semibold"
        >
          Eligibility
        </h2>

        <p className="mt-4 text-sm leading-7 opacity-90">
          You must meet the minimum age required by applicable laws to create an
          account and use GyArchi.
        </p>
      </section>

      <section
        aria-labelledby="account"
        className="shadow shadow-stone-500 rounded-2xl p-3 mb-4"
      >
        <h2
          id="account"
          className="text-2xl text-shadow-stone-500 text-shadow-sm font-semibold"
        >
          User Accounts
        </h2>

        <ul className="list-disc pl-6 mt-4 space-y-2 text-sm leading-7 opacity-90">
          <li>You are responsible for your account.</li>
          <li>Keep your login credentials secure.</li>
          <li>Provide accurate information.</li>
          <li>Do not impersonate another person.</li>
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
          User Content
        </h2>

        <p className="mt-4 text-sm leading-7 opacity-90">
          You retain ownership of your artwork and content. By uploading content,
          you grant GyArchi permission to display, distribute, and promote your
          content within the platform.
        </p>
      </section>

      <section
        aria-labelledby="prohibited"
        className="shadow shadow-stone-500 rounded-2xl p-3 mb-4"
      >
        <h2
          id="prohibited"
          className="text-2xl text-shadow-stone-500 text-shadow-sm font-semibold"
        >
          Prohibited Activities
        </h2>

        <ul className="list-disc pl-6 mt-4 space-y-2 text-sm leading-7 opacity-90">
          <li>Posting illegal content.</li>
          <li>Uploading stolen or copyrighted work without permission.</li>
          <li>Harassment, abuse, or hate speech.</li>
          <li>Spam or misleading content.</li>
          <li>Attempting to hack or disrupt the platform.</li>
          <li>Using automated bots without authorization.</li>
        </ul>
      </section>

      <section
        aria-labelledby="intellectual"
        className="shadow shadow-stone-500 rounded-2xl p-3 mb-4"
      >
        <h2
          id="intellectual"
          className="text-2xl text-shadow-stone-500 text-shadow-sm font-semibold"
        >
          Intellectual Property
        </h2>

        <p className="mt-4 text-sm leading-7 opacity-90">
          All GyArchi branding, logos, design, and platform features are the
          property of GyArchi unless otherwise stated.
        </p>
      </section>

      <section
        aria-labelledby="termination"
        className="shadow shadow-stone-500 rounded-2xl p-3 mb-4"
      >
        <h2
          id="termination"
          className="text-2xl text-shadow-stone-500 text-shadow-sm font-semibold"
        >
          Account Suspension
        </h2>

        <p className="mt-4 text-sm leading-7 opacity-90">
          We reserve the right to suspend or terminate accounts that violate
          these Terms or engage in harmful activities.
        </p>
      </section>

      <section
        aria-labelledby="disclaimer"
        className="shadow shadow-stone-500 rounded-2xl p-3 mb-4"
      >
        <h2
          id="disclaimer"
          className="text-2xl text-shadow-stone-500 text-shadow-sm font-semibold"
        >
          Disclaimer
        </h2>

        <p className="mt-4 text-sm leading-7 opacity-90">
          GyArchi is provided on an "as is" and "as available" basis. We do not
          guarantee uninterrupted or error-free service.
        </p>
      </section>

      <section
        aria-labelledby="liability"
        className="shadow shadow-stone-500 rounded-2xl p-3 mb-4"
      >
        <h2
          id="liability"
          className="text-2xl text-shadow-stone-500 text-shadow-sm font-semibold"
        >
          Limitation of Liability
        </h2>

        <p className="mt-4 text-sm leading-7 opacity-90">
          GyArchi shall not be liable for indirect, incidental, or consequential
          damages resulting from the use of the platform.
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
          Changes to Terms
        </h2>

        <p className="mt-4 text-sm leading-7 opacity-90">
          We may update these Terms & Conditions at any time. Continued use of
          GyArchi after changes become effective constitutes acceptance of the
          updated terms.
        </p>
      </section>

      <footer className="shadow shadow-stone-500 rounded-2xl p-3 mb-4">
        <h2 className="text-2xl text-shadow-stone-500 text-shadow-sm font-semibold">
          Contact
        </h2>

        <p className="mt-4 text-sm leading-7 opacity-90">
          If you have any questions regarding these Terms & Conditions, please
          contact the GyArchi team.
        </p>

        <p className="mt-4 text-sm italic opacity-90">
          Thank you for using GyArchi responsibly.
        </p>
      </footer>

    </main>
  );
}