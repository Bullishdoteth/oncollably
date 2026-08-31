import React from "react"
import { Metadata } from "next"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"

export const metadata: Metadata = {
  title: "Privacy Policy | Oncollably",
  description: "Read Oncollably's Privacy Policy to understand how we collect, protect, and handle your data, Web3 wallet information, and community credentials.",
  openGraph: {
    title: "Privacy Policy | Oncollably",
    description: "Read Oncollably's Privacy Policy to understand how we collect, protect, and handle your data and Web3 credentials.",
    type: "website",
    siteName: "Oncollably",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Oncollably",
    description: "Read Oncollably's Privacy Policy to understand how we protect your Web3 collaboration data.",
  },
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col justify-between selection:bg-zinc-100 selection:text-zinc-900">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-6 sm:px-8 py-16 sm:py-24 space-y-12" id="privacy-policy-content">
        <header className="space-y-4 border-b border-zinc-100 pb-8">
          <span className="inline-block px-3 py-1 bg-zinc-100 text-zinc-800 text-xs font-semibold uppercase tracking-wider rounded-full">
            Legal & Compliance
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-black leading-tight">
            Privacy Policy
          </h1>
          <p className="text-sm text-zinc-500 font-mono">Last updated: August 31, 2026</p>
        </header>

        <article className="prose prose-zinc max-w-none space-y-8 text-zinc-600 leading-relaxed text-sm sm:text-base">
          <section className="space-y-3" id="overview">
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">1. Overview</h2>
            <p>
              Oncollably (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our platform, use our collaboration management tools, or interact with our services.
            </p>
          </section>

          <section className="space-y-3" id="information-collection">
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">2. Information We Collect</h2>
            <p>
              We collect information that you provide directly to us when creating an account, registering a project, or submitting collaboration requests:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-zinc-700 font-medium">
              <li><strong>Account Credentials:</strong> Email address, Google profile information, and authentication tokens.</li>
              <li><strong>Web3 & Wallet Information:</strong> Public wallet addresses provided for whitelist allocation and distribution.</li>
              <li><strong>Community Handles:</strong> Discord handles, Telegram usernames, and X (Twitter) profile links.</li>
              <li><strong>Project Metadata:</strong> Project names, descriptions, supply metrics, and partnership requirements.</li>
            </ul>
          </section>

          <section className="space-y-3" id="information-use">
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">3. How We Use Your Information</h2>
            <p>
              We use the collected information for the following primary purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-zinc-700 font-medium">
              <li>To facilitate cross-community whitelist spot allocations and partnership proposals.</li>
              <li>To verify the authenticity of DAOs, NFT projects, and Collab Managers (preventing sybil attacks and bot farms).</li>
              <li>To allow project leads to export authorized winner wallet lists.</li>
              <li>To notify you of collaboration application status updates and inbound partnership requests.</li>
            </ul>
          </section>

          <section className="space-y-3" id="data-security">
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">4. Data Security & Retention</h2>
            <p>
              We implement industry-standard administrative, technical, and physical security measures to protect your personal and Web3 information. We do not sell your personal data to advertisers or third-party data brokers. Wallet addresses submitted for whitelist allocations are accessible only by authorized project leads of the specific campaign.
            </p>
          </section>

          <section className="space-y-3" id="cookies-analytics">
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">5. Cookies & Tracking Technologies</h2>
            <p>
              We use essential session cookies and privacy-friendly analytics to maintain active user authentication, measure page performance, and improve our services. You can control cookie preferences through your browser settings.
            </p>
          </section>

          <section className="space-y-3" id="contact-us">
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">6. Contact & Data Inquiries</h2>
            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy or data deletion, please contact our privacy team at:
            </p>
            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 font-mono text-xs text-zinc-800 space-y-1">
              <p>Email: <a href="mailto:privacy@oncollably.com" className="text-black font-bold underline">privacy@oncollably.com</a></p>
              <p>Subject: Privacy & Data Inquiry</p>
            </div>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  )
}
