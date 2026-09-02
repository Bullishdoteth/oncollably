'use me'
'use server';

import { db } from './db';
import {
  campaign,
  application,
  campaignAllocation,
  cmPortfolio,
  workspace,
  entry,
  teamMember,
} from './schema';
import { eq, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

/**
 * Create a new Campaign
 */
export async function createCampaignAction(data: {
  workspaceId: string;
  title: string;
  description?: string;
  totalSpots: number;
  allocationType?: 'guaranteed' | 'fcfs';
  ecosystem?: string;
  expiresInDays?: number;
}) {
  try {
    const slug = data.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const id = `cmp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const expiresAt = data.expiresInDays
      ? new Date(Date.now() + data.expiresInDays * 24 * 60 * 60 * 1000)
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await db.insert(campaign).values({
      id,
      workspaceId: data.workspaceId,
      title: data.title,
      slug: slug || `cmp-${Date.now()}`,
      description: data.description || '',
      totalSpots: data.totalSpots || 50,
      allocatedSpots: 0,
      claimedSpots: 0,
      allocationType: data.allocationType || 'guaranteed',
      ecosystem: data.ecosystem || 'Solana',
      status: 'active',
      expiresAt,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    revalidatePath('/project');
    revalidatePath('/project/campaigns');
    revalidatePath('/community/campaigns');

    return { success: true, campaignId: id };
  } catch (error: any) {
    console.error('Error creating campaign:', error);
    return { success: false, error: error?.message || 'Failed to create campaign' };
  }
}

/**
 * Submit a Collab Application
 */
export async function submitApplicationAction(data: {
  campaignId: string;
  applicantWorkspaceId: string;
  applicantType?: 'community' | 'cm';
  requestedSpots?: number;
  pitchMessage?: string;
  discordInvite?: string;
  cmHandle?: string;
}) {
  try {
    const id = `app_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    await db.insert(application).values({
      id,
      campaignId: data.campaignId,
      applicantWorkspaceId: data.applicantWorkspaceId,
      applicantType: data.applicantType || 'community',
      requestedSpots: data.requestedSpots || 10,
      status: 'pending',
      pitchMessage: data.pitchMessage || '',
      discordInvite: data.discordInvite || '',
      cmHandle: data.cmHandle || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    revalidatePath('/project/applications');
    revalidatePath('/community/applications');
    revalidatePath('/cm/applications');

    return { success: true, applicationId: id };
  } catch (error: any) {
    console.error('Error submitting application:', error);
    return { success: false, error: error?.message || 'Failed to submit application' };
  }
}

/**
 * Accept / Reject an Application
 */
export async function updateApplicationStatusAction(
  applicationId: string,
  newStatus: 'accepted' | 'rejected'
) {
  try {
    const [appRecord] = await db
      .select()
      .from(application)
      .where(eq(application.id, applicationId));

    if (!appRecord) {
      return { success: false, error: 'Application not found' };
    }

    await db
      .update(application)
      .set({
        status: newStatus,
        updatedAt: new Date(),
      })
      .where(eq(application.id, applicationId));

    // If accepted, grant allocation & update allocated spots count
    if (newStatus === 'accepted') {
      const allocId = `alloc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      await db.insert(campaignAllocation).values({
        id: allocId,
        campaignId: appRecord.campaignId,
        communityWorkspaceId: appRecord.applicantWorkspaceId,
        allocatedSpots: appRecord.requestedSpots,
        claimedSpots: 0,
        status: 'accepted',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Update allocatedSpots on campaign
      await db
        .update(campaign)
        .set({
          allocatedSpots: sql`${campaign.allocatedSpots} + ${appRecord.requestedSpots}`,
          updatedAt: new Date(),
        })
        .where(eq(campaign.id, appRecord.campaignId));
    }

    revalidatePath('/project/applications');
    revalidatePath('/community/collaborations');
    revalidatePath('/cm/collaborations');

    return { success: true };
  } catch (error: any) {
    console.error('Error updating application status:', error);
    return { success: false, error: error?.message || 'Failed to update application status' };
  }
}

/**
 * Add CM Portfolio Item
 */
export async function addPortfolioItemAction(data: {
  userId: string;
  workspaceId?: string;
  title: string;
  role: string;
  type: string;
  dateStr: string;
  stats: string;
  description: string;
}) {
  try {
    const id = `pf_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    await db.insert(cmPortfolio).values({
      id,
      userId: data.userId,
      workspaceId: data.workspaceId || null,
      title: data.title,
      role: data.role,
      type: data.type,
      dateStr: data.dateStr,
      status: 'Completed',
      stats: data.stats,
      description: data.description,
      createdAt: new Date(),
    });

    revalidatePath('/cm/portfolio');
    revalidatePath('/[username]', 'page');

    return { success: true, portfolioId: id };
  } catch (error: any) {
    console.error('Error adding portfolio item:', error);
    return { success: false, error: error?.message || 'Failed to add portfolio item' };
  }
}

/**
 * Update Workspace Settings
 */
export async function updateWorkspaceSettingsAction(
  workspaceId: string,
  data: {
    name?: string;
    handle?: string;
    bio?: string;
    discord?: string;
    twitter?: string;
    website?: string;
    avatarUrl?: string;
    ecosystems?: string;
  }
) {
  try {
    await db
      .update(workspace)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(workspace.id, workspaceId));

    revalidatePath('/project/settings');
    revalidatePath('/community/settings');
    revalidatePath('/cm/settings');

    return { success: true };
  } catch (error: any) {
    console.error('Error updating workspace settings:', error);
    return { success: false, error: error?.message || 'Failed to update workspace settings' };
  }
}

/**
 * Submit Wallet Entry for a Campaign
 */
export async function submitWalletEntryAction(data: {
  campaignId: string;
  userId?: string;
  walletAddress: string;
  discordTag?: string;
  xHandle?: string;
}) {
  try {
    const id = `ent_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    await db.insert(entry).values({
      id,
      campaignId: data.campaignId,
      userId: data.userId || null,
      walletAddress: data.walletAddress,
      discordTag: data.discordTag || '',
      xHandle: data.xHandle || '',
      status: 'submitted',
      submittedAt: new Date(),
    });

    // Increment claimed spots
    await db
      .update(campaign)
      .set({
        claimedSpots: sql`${campaign.claimedSpots} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(campaign.id, data.campaignId));

    return { success: true, entryId: id };
  } catch (error: any) {
    console.error('Error submitting wallet entry:', error);
    return { success: false, error: error?.message || 'Failed to submit wallet entry' };
  }
}
