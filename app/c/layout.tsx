import type { Metadata } from "next"
import { constructMetadata } from "@/lib/og-builder"

export const metadata: Metadata = constructMetadata({
  title: "Public Collaboration Campaigns | Oncollably",
  description:
    "Discover and apply for verified Web3 whitelist spot allocations, NFT giveaways, and community partnerships on Oncollably.",
  path: "/c",
  type: "website",
})

export default function PublicCampaignsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
