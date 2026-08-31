"use client"

import React, { useState } from "react"
import Link from "next/link"

const faqs = [
  {
    question: "What is Oncollably and how does it work?",
    answer:
      "Oncollably is a unified Web3 collaboration platform that replaces chaotic Discord DMs and spreadsheets. It lets project founders, DAOs, and collab managers submit partnership proposals, allocate whitelist spots, verify partner authenticity, and track every deal from one central dashboard.",
  },
  {
    question: "How does the $10 one-time payment work?",
    answer:
      "You pay a simple flat fee of $10 once per project launch. There are zero recurring monthly subscriptions, hidden fees, or surprise charges. You get lifetime access to all collaboration management features for your project.",
  },
  {
    question: "How does Oncollably prevent spam and unverified collabs?",
    answer:
      "We implement community badge verifications and manager reputation metrics. Projects and collab managers are verified to ensure that partnership requests come from authentic Web3 communities with real engagement.",
  },
  {
    question: "Can I allocate and track Whitelist (WL) spots automatically?",
    answer:
      "Yes! You can allocate specific whitelist allocations directly to partner communities, monitor acceptance status in real-time, enforce custom requirements, and export finalized wallet lists whenever you are ready.",
  },
  {
    question: "Who is Oncollably designed for?",
    answer:
      "Oncollably is built for NFT projects, Web3 gaming studios, DAOs, community managers, and Web3 marketing agencies looking for a professional, transparent tool to execute cross-community collaborations.",
  },
  {
    question: "How do I get started?",
    answer:
      "Getting started takes less than 2 minutes. Click 'Create account', set up your project or manager profile, define your collab requirements, and begin managing partnerships effortlessly.",
  },
]

export function FAQs() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faqs" className="scroll-mt-20 relative overflow-hidden py-16 sm:py-24 lg:py-32 border-t border-zinc-100 bg-white">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 space-y-12">
        {/* Main Headline */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="inline-block px-3 py-1 bg-zinc-100 text-zinc-800 text-xs font-semibold uppercase tracking-widest rounded-full">
            Got Questions?
          </span>
          <h2 className="text-4xl sm:text-5xl font-regular tracking-tight text-black leading-[1.1]">
            Frequently Asked Questions
          </h2>
          <p className="text-lg sm:text-xl text-zinc-600 font-normal leading-relaxed">
            Everything you need to know about Oncollably and Web3 collaboration management.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4 pt-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div
                key={index}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "border-zinc-300 bg-zinc-50/80 shadow-sm"
                    : "border-zinc-200/80 bg-white hover:border-zinc-300 hover:bg-zinc-50/50"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left p-6 sm:p-7 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg font-semibold text-zinc-900 pr-2">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen ? "bg-black text-white rotate-180" : "bg-zinc-100 text-zinc-600"
                    }`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 sm:px-7 sm:pb-7 text-sm sm:text-base text-zinc-600 leading-relaxed border-t border-zinc-200/60 pt-4 animate-in fade-in duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Support callout */}
        <div className="pt-8 text-center bg-zinc-50 rounded-3xl p-8 border border-zinc-100 space-y-3">
          <h3 className="text-lg font-semibold text-zinc-900">
            Still have questions?
          </h3>
          <p className="text-sm text-zinc-600 max-w-md mx-auto">
            Can't find the answer you're looking for? Reach out to our support team or create an account to get started.
          </p>
          <div className="pt-2">
            <Link
              href="/create-account"
              className="inline-flex items-center justify-center px-6 py-3 bg-black hover:bg-zinc-800 text-white font-medium text-sm rounded-full transition-all duration-200 shadow-sm cursor-pointer"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

