import { db } from './db';
import {
  user,
  workspace,
  campaign,
  campaignAllocation,
  application,
  cmPortfolio,
} from './schema';
import { eq } from 'drizzle-orm';

export async function ensureSeedData() {
  try {
    // 1. Check if seed user exists
    const [existingUser] = await db.select().from(user).where(eq(user.id, 'usr_demo_1'));

    let userId = 'usr_demo_1';

    if (!existingUser) {
      await db.insert(user).values({
        id: 'usr_demo_1',
        name: 'Alex Rivera',
        email: 'alex@oncollably.com',
        emailVerified: true,
        onboarded: true,
        workspaceType: 'cm',
        handle: 'collabmanager',
        discord: 'alexrivera#1337',
        twitter: 'alexrivera_web3',
        bio: 'Full Stack Web3 Collab Manager & Growth Strategist.',
      });
    }

    // 2. Check if CyberSamurai Project Workspace exists
    const [existingProject] = await db
      .select()
      .from(workspace)
      .where(eq(workspace.handle, 'cybersamurai'));

    if (!existingProject) {
      await db.insert(workspace).values({
        id: 'ws_cybersamurai',
        userId,
        name: 'CyberSamurai NFT',
        handle: 'cybersamurai',
        type: 'project',
        discord: 'discord.gg/cybersamurai',
        twitter: 'CyberSamuraiNFT',
        bio: 'Gaming project building high-octane cybernetic avatars on Solana.',
        ecosystems: 'Solana',
        status: 'active',
        paid: true,
      });

      // Insert Demo Campaigns
      await db.insert(campaign).values([
        {
          id: 'cmp_cybersamurai_1',
          workspaceId: 'ws_cybersamurai',
          title: 'Guaranteed Whitelist Allocation',
          slug: 'guaranteed-whitelist-allocation',
          description:
            'Guaranteed WL spots for verified Web3 DAOs, alpha groups, and partner gaming communities.',
          totalSpots: 250,
          allocatedSpots: 180,
          claimedSpots: 120,
          allocationType: 'guaranteed',
          ecosystem: 'Solana',
          status: 'active',
          expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        },
        {
          id: 'cmp_cybersamurai_2',
          workspaceId: 'ws_cybersamurai',
          title: 'FCFS Whitelist Allocation',
          slug: 'fcfs-whitelist-allocation',
          description:
            'First-come-first-serve spots for partner Discord servers and Web3 creators.',
          totalSpots: 100,
          allocatedSpots: 50,
          claimedSpots: 35,
          allocationType: 'fcfs',
          ecosystem: 'Solana',
          status: 'active',
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      ]);
    }

    // 3. Check if Alpha Seekers DAO Workspace exists
    const [existingCommunity] = await db
      .select()
      .from(workspace)
      .where(eq(workspace.handle, 'alphaseekers'));

    if (!existingCommunity) {
      await db.insert(workspace).values({
        id: 'ws_alphaseekers',
        userId,
        name: 'Alpha Seekers DAO',
        handle: 'alphaseekers',
        type: 'community',
        discord: 'discord.gg/alphaseekers',
        twitter: 'AlphaSeekersDAO',
        bio: 'Premier Web3 alpha group and DAO dedicated to discovering top-tier NFT and gaming mints.',
        ecosystems: 'Solana, Ethereum',
        status: 'active',
        paid: true,
      });

      // Add allocation connection
      await db.insert(campaignAllocation).values({
        id: 'alloc_demo_1',
        campaignId: 'cmp_cybersamurai_1',
        communityWorkspaceId: 'ws_alphaseekers',
        allocatedSpots: 25,
        claimedSpots: 18,
        status: 'accepted',
      });
    }

    // 4. Check if Alex CM Workspace exists
    const [existingCm] = await db
      .select()
      .from(workspace)
      .where(eq(workspace.handle, 'collabmanager'));

    if (!existingCm) {
      await db.insert(workspace).values({
        id: 'ws_collabmanager',
        userId,
        name: 'Alex (Apex CM)',
        handle: 'collabmanager',
        type: 'cm',
        discord: 'discord.gg/apexcm',
        twitter: 'ApexCollabManager',
        bio: 'Verified Web3 Collab Manager managing partnership rosters for 15+ top projects.',
        ecosystems: 'Solana, Ethereum, Bitcoin L2',
        status: 'active',
        paid: true,
      });

      // Insert Demo Portfolio Items
      await db.insert(cmPortfolio).values([
        {
          id: 'pf_1',
          userId,
          workspaceId: 'ws_collabmanager',
          title: 'Apex DAOs x CyberSquad Collab',
          role: 'Lead Collab Manager',
          type: 'Whitelist Allocation',
          dateStr: 'Aug 28, 2026',
          status: 'Completed',
          stats: '50 WL Spots • 340 Entries Verified',
          description:
            'Successfully orchestrated cross-community whitelist allocation with 100% sybil protection and verified wallet exports.',
        },
        {
          id: 'pf_2',
          userId,
          workspaceId: 'ws_collabmanager',
          title: 'Solana Collective Partnership Launch',
          role: 'Community Growth Strategist',
          type: 'Verification & Onboarding',
          dateStr: 'Aug 15, 2026',
          status: 'Completed',
          stats: 'Official CM Badge • 5 Communities Partnered',
          description:
            'Verified community manager credentials and set up automated collab request routing for 5 top-tier Solana DAOs.',
        },
        {
          id: 'pf_3',
          userId,
          workspaceId: 'ws_collabmanager',
          title: 'Alpha Guild Whitelist Giveaway',
          role: 'Campaign Director',
          type: 'Giveaway Campaign',
          dateStr: 'Jul 30, 2026',
          status: 'Completed',
          stats: '100 Guaranteed Spots • 1,200 Participants',
          description:
            'Executed high-converting whitelist campaign for 1,200 participants with real-time winner verification logs.',
        },
      ]);
    }
  } catch (error) {
    console.error('Error seeding initial DB data:', error);
  }
}
