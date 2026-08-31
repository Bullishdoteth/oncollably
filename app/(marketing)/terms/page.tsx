import React from "react"
import { Metadata } from "next"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"

export const metadata: Metadata = {
  title: "Terms of Service | Oncollably",
  description: "Review Oncollably's Terms of Service governing platform usage, $10 one-time payment structure, whitelist allocations, and user conduct.",
  openGraph: {
    title: "Terms of Service | Oncollably",
    description: "Review Oncollably's Terms of Service governing platform usage and campaign management.",
    type: "website",
    siteName: "Oncollably",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service | Oncollably",
    description: "Review Oncollably's Terms of Service.",
  },
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col justify-between selection:bg-zinc-100 selection:text-zinc-900">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-6 sm:px-8 py-16 sm:py-24 space-y-12" id="terms-of-service-content">
        <header className="space-y-4 border-b border-zinc-100 pb-8">
          <span className="inline-block px-3 py-1 bg-zinc-100 text-zinc-800 text-xs font-semibold uppercase tracking-wider rounded-full">
            Legal & Compliance
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-black leading-tight">
            Terms of Service
          </h1>
          <p className="text-sm text-zinc-500 font-mono">Last updated: August 31, 2026</p>
        </header>

        <article className="prose prose-zinc max-w-none space-y-8 text-zinc-600 leading-relaxed text-sm sm:text-base">
          <section className="space-y-3" id="acceptance">
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">1. Acceptance of Terms</h2>
            <p>
              By creating an account, connecting a Web3 wallet, or using any services provided by Oncollably (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
          </section>

          <section className="space-y-3" id="pricing-payment">
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">2. One-Time Payment Structure</h2>
            <p>
              Oncollably operates on a flat <strong>$10 one-time payment per project launch</strong> model. There are zero recurring monthly subscriptions or hidden maintenance fees. Once payment is processed, the project receives access to collaboration management tools and wallet export features for that campaign. All fees are non-refundable once campaign tools have been accessed.
            </p>
          </section>

          <section className="space-y-3" id="user-conduct">
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">3. User Conduct & Sybil Restrictions</h2>
            <p>
              Project creators, DAOs, and Collab Managers agree to use the platform in good faith. You explicitly agree not to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-zinc-700 font-medium">
              <li>Submit automated bot entries, fake wallet lists, or sybil attacks.</li>
              <li>Impersonate verified Web3 projects, DAOs, or collab managers.</li>
              <li>Attempt to scrape, compromise, or disrupt platform infrastructure.</li>
            </ul>
            <p>
              Violation of conduct rules will result in immediate termination of account access and revocation of verified badges.
            </p>
          </section>

          <section className="space-y-3" id="limitation-liability">
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">4. Limitation of Liability</h2>
            <p>
              Oncollably provides software tools to facilitate partnership proposals and whitelist distribution. We do not guarantee secondary market performance, mint success, or financial returns for any Web3 project listed on the platform. Use of third-party community links and external Web3 protocols is at your sole risk.
            </p>
          </section>

          <section className="space-y-3" id="modifications">
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">5. Modifications to Terms</h2>
            <p>
              We reserve the right to modify these Terms of Service at any time. Continued use of the platform following published changes constitutes acceptance of the revised terms.
            </p>
          </section>

          <section className="space-y-3" id="contact">
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">6. Legal Contact</h2>
            <p>
              For legal inquiries or questions regarding these Terms, please email:{" "}
              <a href="mailto:legal@oncollably.com" className="text-black font-bold underline">
                legal@oncollably.com
              </a>
              .
            </p>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  )
}
