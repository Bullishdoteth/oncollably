"use client"

import React from "react"

const testimonialsRow1 = [
  {
    name: "Alex Rivera",
    handle: "@alex_solbuilder",
    role: "Founder @ Apex DAOs",
    avatar: "AR",
    avatarBg: "bg-indigo-600",
    comment:
      "Oncollably completely changed how we run whitelist allocations. No more lost Discord DMs or tracking 50 different spreadsheets. Everything is seamless.",
    xUrl: "https://x.com/alex_solbuilder",
    date: "Aug 24, 2026",
  },
  {
    name: "Sarah Chen",
    handle: "@sarah_web3collab",
    role: "Head of Partnerships @ Alpha Guild",
    avatar: "SC",
    avatarBg: "bg-emerald-600",
    comment:
      "The $10 one-time fee is an absolute no-brainer. We managed 30+ community collabs last month with zero headaches and verified wallet list exports.",
    xUrl: "https://x.com/sarah_web3collab",
    date: "Aug 20, 2026",
  },
  {
    name: "Marcus Vance",
    handle: "@marcus_evm",
    role: "Lead Collab Manager @ EVM Builders",
    avatar: "MV",
    avatarBg: "bg-purple-600",
    comment:
      "Finally a tool that filters out spam partnership requests! The community verification badges give us total confidence before agreeing to any collab.",
    xUrl: "https://x.com/marcus_evm",
    date: "Aug 18, 2026",
  },
  {
    name: "Elena Rostova",
    handle: "@elena_cyber",
    role: "Community Lead @ CyberSquad",
    avatar: "ER",
    avatarBg: "bg-rose-600",
    comment:
      "Automated spot tracking and direct manager messaging saved our team 20+ hours a week during launch season. 10/10 recommend Oncollably.",
    xUrl: "https://x.com/elena_cyber",
    date: "Aug 15, 2026",
  },
]

const testimonialsRow2 = [
  {
    name: "David K.",
    handle: "@davidk_block",
    role: "Co-Founder @ BlockNexus Agency",
    avatar: "DK",
    avatarBg: "bg-amber-600",
    comment:
      "Managing collabs for 10+ client projects used to be a nightmare. Oncollably’s unified dashboard makes tracking and distribution effortless.",
    xUrl: "https://x.com/davidk_block",
    date: "Aug 26, 2026",
  },
  {
    name: "Kairo Tech",
    handle: "@kairo_sol",
    role: "Core Contributor @ Solana Collective",
    avatar: "KT",
    avatarBg: "bg-cyan-600",
    comment:
      "Simple, fast, and sybil-resistant. If you are launching a Web3 project, Oncollably is mandatory infrastructure for your team.",
    xUrl: "https://x.com/kairo_sol",
    date: "Aug 22, 2026",
  },
  {
    name: "Liam O'Connor",
    handle: "@liam_hyper",
    role: "Collab Lead @ HyperVerse",
    avatar: "LO",
    avatarBg: "bg-blue-600",
    comment:
      "The UI is clean, intuitive, and lightning fast. Our collab partners love how easy it is to claim and verify whitelist allocations.",
    xUrl: "https://x.com/liam_hyper",
    date: "Aug 19, 2026",
  },
  {
    name: "Zoe Martinez",
    handle: "@zoe_metaspace",
    role: "Partnerships @ MetaSpace Network",
    avatar: "ZM",
    avatarBg: "bg-teal-600",
    comment:
      "No recurring subscriptions, total transparency, and verified manager profiles. Oncollably set a new standard for Web3 partnerships.",
    xUrl: "https://x.com/zoe_metaspace",
    date: "Aug 12, 2026",
  },
]

function XIcon() {
  return (
    <svg className="w-4 h-4 fill-current text-zinc-400 group-hover:text-white transition-colors shrink-0" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function TestimonyCard({ item }: { item: (typeof testimonialsRow1)[0] }) {
  return (
    <a
      href={item.xUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group shrink-0 w-[320px] sm:w-[380px] p-6 rounded-2xl border border-zinc-800 bg-zinc-900/90 hover:border-zinc-700 hover:shadow-xl transition-all duration-200 flex flex-col justify-between space-y-4 cursor-pointer"
    >
      <div className="space-y-3">
        {/* Author Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full ${item.avatarBg} text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0`}
            >
              {item.avatar}
            </div>
            <div className="text-left overflow-hidden">
              <h4 className="text-sm font-bold text-white truncate group-hover:text-zinc-100 transition-colors">
                {item.name}
              </h4>
              <p className="text-xs text-zinc-400 font-medium truncate">{item.handle}</p>
            </div>
          </div>

          <XIcon />
        </div>

        {/* Comment */}
        <p className="text-sm text-zinc-200 leading-relaxed font-normal text-left">
          "{item.comment}"
        </p>
      </div>

      {/* Footer / Meta */}
      <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
        <span className="font-medium text-zinc-400">{item.role}</span>
        <span>{item.date}</span>
      </div>
    </a>
  )
}

export function Testimony() {
  return (
    <section id="testimonials" className="scroll-mt-20 relative overflow-hidden py-16 sm:py-24 border-t border-zinc-800 bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-12 text-center">
        {/* Section Header */}
        <div className="space-y-4 max-w-2xl mx-auto">
          <span className="inline-block px-3 py-1 bg-zinc-800 text-zinc-300 text-xs font-semibold uppercase tracking-widest rounded-full border border-zinc-700">
            Community Feedback
          </span>
          <h2 className="text-4xl sm:text-5xl font-regular tracking-tight text-white leading-[1.1]">
            Loved by Web3 Builders & Managers
          </h2>
          <p className="text-lg sm:text-xl text-zinc-400 font-normal leading-relaxed">
            See what project leads, DAOs, and collab managers are saying on X.
          </p>
        </div>

        {/* Marquee Container with Left & Right Gradient Fades */}
        <div className="relative w-full overflow-hidden py-4 space-y-6">
          {/* Left & Right Gradient Fade Masks */}
          <div className="absolute top-0 bottom-0 left-0 w-24 sm:w-48 bg-gradient-to-r from-black via-black/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-24 sm:w-48 bg-gradient-to-l from-black via-black/80 to-transparent z-10 pointer-events-none" />

          {/* Row 1: Leftward Marquee */}
          <div className="animate-marquee flex items-center gap-6 px-4 hover:[animation-play-state:paused]">
            {[...testimonialsRow1, ...testimonialsRow1].map((item, index) => (
              <TestimonyCard key={`row1-${index}`} item={item} />
            ))}
          </div>

          {/* Row 2: Rightward Marquee */}
          <div className="animate-marquee-reverse flex items-center gap-6 px-4 hover:[animation-play-state:paused]">
            {[...testimonialsRow2, ...testimonialsRow2].map((item, index) => (
              <TestimonyCard key={`row2-${index}`} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
