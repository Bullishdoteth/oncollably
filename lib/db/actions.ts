'use server';

import { db } from './db';
import {
  campaign,
  application,
  campaignAllocation,
  cmPortfolio,
  workspace,
  entry,
  communityRepresentative,
  user,
} from './schema';
import { eq, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth/auth';
import {
  sendCampaignCreatedEmail,
  sendCollabApplicationNotificationEmail,
  sendApplicationStatusEmail,
  sendWalletEntryEmail,
} from '@/services/email';
import { createInAppNotification } from '@/services/notifications';

/**
 * Create a new Campaign
 */
export async function createCampaignAction(data: {
  workspaceId?: string;
  handle?: string;
  title: string;
  description?: string;
  totalSpots: number;
  allocationType?: 'guaranteed' | 'fcfs';
  ecosystem?: string;
  expiresInDays?: number;
}) {
  try {
    let resolvedWorkspaceId = data.workspaceId;

    // Check if workspaceId exists in database
    if (resolvedWorkspaceId) {
      const [existingWs] = await db
        .select()
        .from(workspace)
        .where(eq(workspace.id, resolvedWorkspaceId))
        .limit(1);

      if (!existingWs) {
        resolvedWorkspaceId = undefined;
      }
    }

    // If workspaceId was missing or invalid, resolve real workspace from handle or DB
    if (!resolvedWorkspaceId) {
      const [foundWs] = await db
        .select()
        .from(workspace)
        .where(
          data.handle
            ? eq(workspace.handle, data.handle)
            : eq(workspace.type, "project")
        )
        .limit(1);

      if (foundWs) {
        resolvedWorkspaceId = foundWs.id;
      } else {
        const [anyWs] = await db.select().from(workspace).limit(1);
        if (anyWs) {
          resolvedWorkspaceId = anyWs.id;
        }
      }
    }

    if (!resolvedWorkspaceId) {
      return { success: false, error: "No valid workspace found in database. Please create a workspace first." };
    }

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
      workspaceId: resolvedWorkspaceId,
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

    // 1. Create In-App Notification for Project Workspace
    await createInAppNotification({
      workspaceId: resolvedWorkspaceId,
      title: "Campaign Launched",
      message: `Your campaign '${data.title}' is now live with ${data.totalSpots} spots.`,
      type: "campaign",
      link: "/project/campaigns",
    });

    // 2. Send Campaign Launch Confirmation Email to Workspace Owner
    const [projectWs] = await db.select().from(workspace).where(eq(workspace.id, resolvedWorkspaceId));
    if (projectWs?.userId) {
      const [ownerUser] = await db.select().from(user).where(eq(user.id, projectWs.userId));
      if (ownerUser?.email) {
        sendCampaignCreatedEmail({
          to: ownerUser.email,
          campaignTitle: data.title,
          totalSpots: data.totalSpots || 50,
          allocationType: data.allocationType || 'guaranteed',
          ecosystem: data.ecosystem || 'Solana',
        }).catch((err) => console.error("Error sending campaign launch email:", err));
      }
    }

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
  representedCommunityWorkspaceId?: string;
  representedCommunityName?: string;
  representedCommunityType?: string;
  discordMemberCount?: number;
  xFollowerCount?: number;
  xHandle?: string;
  requestedSpots?: number;
  pitchMessage?: string;
  discordInvite?: string;
  cmHandle?: string;
}) {
  try {
    // 1. Check if campaign exists and if it is closed/full
    const [cmpRecord] = await db.select().from(campaign).where(eq(campaign.id, data.campaignId));
    if (!cmpRecord) {
      return { success: false, error: 'Campaign not found' };
    }

    const isClosed =
      cmpRecord.status === 'closed' ||
      cmpRecord.status === 'completed' ||
      (cmpRecord.allocatedSpots || 0) >= cmpRecord.totalSpots;

    if (isClosed) {
      return {
        success: false,
        error: 'This campaign is closed and is no longer accepting new collaboration applications.',
      };
    }

    const id = `app_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    await db.insert(application).values({
      id,
      campaignId: data.campaignId,
      applicantWorkspaceId: data.applicantWorkspaceId,
      representedCommunityWorkspaceId: data.representedCommunityWorkspaceId || null,
      representedCommunityName: data.representedCommunityName || null,
      representedCommunityType: data.representedCommunityType || 'DAO',
      discordMemberCount: data.discordMemberCount || 12500,
      xFollowerCount: data.xFollowerCount || 45000,
      xHandle: data.xHandle || '',
      applicantType: data.applicantType || 'community',
      requestedSpots: data.requestedSpots || 10,
      status: 'pending',
      pitchMessage: data.pitchMessage || '',
      discordInvite: data.discordInvite || '',
      cmHandle: data.cmHandle || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Fetch target campaign and project workspace details
    const [applicantWs] = await db.select().from(workspace).where(eq(workspace.id, data.applicantWorkspaceId));

    if (cmpRecord) {
      const [projectWs] = await db.select().from(workspace).where(eq(workspace.id, cmpRecord.workspaceId));

      // 1. Notify Project Workspace (Incoming Application)
      await createInAppNotification({
        workspaceId: cmpRecord.workspaceId,
        title: "New Collab Application",
        message: `${applicantWs?.name || "A community"} requested ${data.requestedSpots || 10} spots for '${cmpRecord.title}'.`,
        type: "application",
        link: "/project/applications",
      });

      // 2. Send Notification Email to Project Lead
      if (projectWs?.userId) {
        const [projectOwner] = await db.select().from(user).where(eq(user.id, projectWs.userId));
        if (projectOwner?.email) {
          sendCollabApplicationNotificationEmail({
            to: projectOwner.email,
            projectTitle: projectWs.name,
            communityName: applicantWs?.name || "Partner DAO",
            requestedSpots: data.requestedSpots || 10,
            pitchMessage: data.pitchMessage,
          }).catch((err) => console.error("Error sending collab application email:", err));
        }
      }
    }

    // 3. Notify Applicant Workspace (Confirmation)
    await createInAppNotification({
      workspaceId: data.applicantWorkspaceId,
      title: "Collab Application Submitted",
      message: `Your request for ${data.requestedSpots || 10} spots was sent to ${cmpRecord?.title || "the project"}.`,
      type: "application",
      link: "/community/applications",
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
  newStatus: 'accepted' | 'rejected',
  deadlineHours: number = 48
) {
  try {
    const [appRecord] = await db
      .select()
      .from(application)
      .where(eq(application.id, applicationId));

    if (!appRecord) {
      return { success: false, error: 'Application not found' };
    }

    const calculatedDeadline = new Date(Date.now() + deadlineHours * 3600 * 1000);

    await db
      .update(application)
      .set({
        status: newStatus,
        deadline: newStatus === 'accepted' ? calculatedDeadline : null,
        updatedAt: new Date(),
      })
      .where(eq(application.id, applicationId));

    const [cmpRecord] = await db.select().from(campaign).where(eq(campaign.id, appRecord.campaignId));
    const [projectWs] = cmpRecord ? await db.select().from(workspace).where(eq(workspace.id, cmpRecord.workspaceId)) : [null];

    // If accepted, grant allocation & update allocated spots count with deadline
    if (newStatus === 'accepted') {
      const allocId = `alloc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      await db.insert(campaignAllocation).values({
        id: allocId,
        campaignId: appRecord.campaignId,
        communityWorkspaceId: appRecord.applicantWorkspaceId,
        allocatedSpots: appRecord.requestedSpots,
        claimedSpots: 0,
        deadline: calculatedDeadline,
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

      // Auto-close campaign if total allocated spots reaches or exceeds totalSpots capacity
      const [updatedCmp] = await db.select().from(campaign).where(eq(campaign.id, appRecord.campaignId));
      if (updatedCmp && (updatedCmp.allocatedSpots || 0) >= updatedCmp.totalSpots) {
        await db
          .update(campaign)
          .set({
            status: 'closed',
            updatedAt: new Date(),
          })
          .where(eq(campaign.id, appRecord.campaignId));
      }
    }


    // 1. Notify Applicant Workspace via In-App Notification
    const notifTitle = newStatus === 'accepted' ? "🎉 Application Accepted!" : "Application Status Update";
    const notifMsg = newStatus === 'accepted'
      ? `${projectWs?.name || 'Project'} accepted your application and granted ${appRecord.requestedSpots} spots!`
      : `${projectWs?.name || 'Project'} reviewed your application for '${cmpRecord?.title || 'the campaign'}'.`;

    await createInAppNotification({
      workspaceId: appRecord.applicantWorkspaceId,
      title: notifTitle,
      message: notifMsg,
      type: "allocation",
      link: "/community/collaborations",
    });

    // 2. Send Application Status Update Email to Applicant Owner
    const [applicantWs] = await db.select().from(workspace).where(eq(workspace.id, appRecord.applicantWorkspaceId));
    if (applicantWs?.userId) {
      const [applicantOwner] = await db.select().from(user).where(eq(user.id, applicantWs.userId));
      if (applicantOwner?.email) {
        sendApplicationStatusEmail({
          to: applicantOwner.email,
          status: newStatus,
          projectTitle: projectWs?.name || "Project Partner",
          campaignTitle: cmpRecord?.title || "Giveaway Campaign",
          requestedSpots: appRecord.requestedSpots,
        }).catch((err) => console.error("Error sending application status email:", err));
      }
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
  userId?: string;
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

    let resolvedUserId = data.userId;

    // 1. Try resolving userId from session if not directly passed
    if (!resolvedUserId) {
      try {
        const reqHeaders = await headers();
        const session = await auth.api.getSession({ headers: reqHeaders });
        if (session?.user?.id) {
          resolvedUserId = session.user.id;
        }
      } catch (e) {
        // Headers might not be available in non-HTTP contexts
      }
    }

    // 2. Validate workspaceId if provided
    let validWorkspaceId: string | null = null;
    if (data.workspaceId) {
      const [ws] = await db.select().from(workspace).where(eq(workspace.id, data.workspaceId));
      if (ws) {
        validWorkspaceId = ws.id;
        if (!resolvedUserId && ws.userId) {
          resolvedUserId = ws.userId;
        }
      }
    }

    // 3. Fallback to existing user in user table
    if (!resolvedUserId) {
      const [firstUser] = await db.select().from(user).limit(1);
      if (firstUser) {
        resolvedUserId = firstUser.id;
      } else {
        // Create default user to fulfill foreign key constraint if user table is completely empty
        const fallbackUserId = `user_default_${Date.now()}`;
        await db.insert(user).values({
          id: fallbackUserId,
          name: 'Default User',
          email: 'user@oncollably.com',
          emailVerified: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        resolvedUserId = fallbackUserId;
      }
    }

    // 4. Fallback: If validWorkspaceId is still null, lookup user's workspace or any workspace from DB
    if (!validWorkspaceId && resolvedUserId) {
      const [userWs] = await db
        .select()
        .from(workspace)
        .where(eq(workspace.userId, resolvedUserId))
        .limit(1);
      if (userWs) {
        validWorkspaceId = userWs.id;
      } else {
        const [anyWs] = await db.select().from(workspace).limit(1);
        if (anyWs) {
          validWorkspaceId = anyWs.id;
        }
      }
    }

    await db.insert(cmPortfolio).values({
      id,
      userId: resolvedUserId,
      workspaceId: validWorkspaceId,
      title: data.title,
      role: data.role,
      type: data.type,
      dateStr: data.dateStr,
      status: 'Completed',
      stats: data.stats,
      description: data.description,
      createdAt: new Date(),
    });

    // In-App Notification for CM Workspace
    if (validWorkspaceId) {
      await createInAppNotification({
        workspaceId: validWorkspaceId,
        title: "Portfolio Entry Added",
        message: `Work history item '${data.title}' was added to your profile.`,
        type: "system",
        link: "/cm/portfolio",
      });
    }

    if (validWorkspaceId) {
      const [ws] = await db.select().from(workspace).where(eq(workspace.id, validWorkspaceId));
      if (ws?.handle) {
        revalidatePath(`/${ws.handle}`);
        revalidatePath(`/@${ws.handle}`);
      }
    }

    revalidatePath('/cm/portfolio');
    revalidatePath('/[username]', 'page');

    return { success: true, portfolioId: id };
  } catch (error: any) {
    console.error('Error adding portfolio item:', error);
    return { success: false, error: error.message || 'Failed to add portfolio item' };
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

    // In-App Notification
    await createInAppNotification({
      workspaceId,
      title: "Settings Updated",
      message: "Workspace details and social links have been updated successfully.",
      type: "system",
      link: "/project/settings",
    });

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

    // Fetch campaign details
    const [cmpRecord] = await db.select().from(campaign).where(eq(campaign.id, data.campaignId));

    if (cmpRecord) {
      // 1. In-App Notification for Project Workspace
      await createInAppNotification({
        workspaceId: cmpRecord.workspaceId,
        title: "New Wallet Entry Claimed",
        message: `Wallet ${data.walletAddress.substring(0, 8)}... registered for '${cmpRecord.title}'.`,
        type: "entry",
        link: "/project/campaigns",
      });

      // 2. Email Notification to user if logged in
      if (data.userId) {
        const [memberUser] = await db.select().from(user).where(eq(user.id, data.userId));
        if (memberUser?.email) {
          sendWalletEntryEmail({
            to: memberUser.email,
            campaignTitle: cmpRecord.title,
            walletAddress: data.walletAddress,
          }).catch((err) => console.error("Error sending wallet entry email:", err));
        }
      }
    }

    return { success: true, entryId: id };
  } catch (error: any) {
    console.error('Error submitting wallet entry:', error);
    return { success: false, error: error?.message || 'Failed to submit wallet entry' };
  }
}

/**
 * Add a Community Representative (Collab Manager)
 */
export async function addCommunityRepresentativeAction(data: {
  communityWorkspaceId: string;
  name: string;
  handle: string;
  email?: string;
  role?: string;
}) {
  try {
    const id = `rep_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const cleanHandle = data.handle.replace(/^@/, '');

    // Look up CM workspace if handle exists
    const [cmWs] = await db
      .select()
      .from(workspace)
      .where(eq(workspace.handle, cleanHandle));

    await db.insert(communityRepresentative).values({
      id,
      communityWorkspaceId: data.communityWorkspaceId,
      cmWorkspaceId: cmWs?.id || null,
      name: data.name,
      handle: cleanHandle,
      email: data.email || null,
      role: data.role || 'Collab Manager',
      status: 'active',
      createdAt: new Date(),
    });

    // Notify CM Workspace if linked
    if (cmWs?.id) {
      await createInAppNotification({
        workspaceId: cmWs.id,
        title: "Added as Representative",
        message: `You have been added as a Collab Manager representative for a community!`,
        type: "system",
        link: "/cm/opportunities",
      });
    }

    revalidatePath('/community/representatives');

    return { success: true, representativeId: id };
  } catch (error: any) {
    console.error('Error adding community representative:', error);
    return { success: false, error: error?.message || 'Failed to add representative' };
  }
}

/**
 * Remove a Community Representative
 */
export async function removeCommunityRepresentativeAction(id: string) {
  try {
    await db
      .delete(communityRepresentative)
      .where(eq(communityRepresentative.id, id));

    revalidatePath('/community/representatives');
    return { success: true };
  } catch (error: any) {
    console.error('Error removing representative:', error);
    return { success: false, error: error?.message || 'Failed to remove representative' };
  }
}

/**
 * Submit Bulk Wallets for an Accepted Collaboration Deal (Platform Sheet)
 */
export async function submitBulkWalletsAction(data: {
  allocationId: string;
  campaignId: string;
  communityWorkspaceId: string;
  wallets: Array<{
    walletAddress: string;
    discordTag?: string;
    xHandle?: string;
  }>;
}) {
  try {
    const validWallets = data.wallets.filter((w) => w.walletAddress && w.walletAddress.trim().length > 0);

    if (validWallets.length === 0) {
      return { success: false, error: 'No valid wallet addresses provided' };
    }

    // Fetch allocation to check deadline and allocated spot limit
    const [allocRecord] = await db.select().from(campaignAllocation).where(eq(campaignAllocation.id, data.allocationId));

    const maxSpots = allocRecord?.allocatedSpots || 10;
    if (validWallets.length > maxSpots) {
      return {
        success: false,
        error: `You cannot submit more than the required ${maxSpots} wallets for this allocation.`,
      };
    }

    if (allocRecord?.deadline && Date.now() > new Date(allocRecord.deadline).getTime()) {
      // Mark as expired
      await db
        .update(campaignAllocation)
        .set({ status: 'expired', updatedAt: new Date() })
        .where(eq(campaignAllocation.id, data.allocationId));

      return { success: false, error: 'The submission deadline has passed. This deal has closed.' };
    }

    // Insert entry records for each wallet with allocation tracking
    for (const item of validWallets) {
      const entryId = `ent_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      await db.insert(entry).values({
        id: entryId,
        campaignId: data.campaignId,
        allocationId: data.allocationId,
        submittedByWorkspaceId: data.communityWorkspaceId,
        walletAddress: item.walletAddress.trim(),
        discordTag: item.discordTag || null,
        xHandle: item.xHandle || null,
        status: 'submitted',
        submittedAt: new Date(),
      });
    }

    // Update campaignAllocation to mark status as 'completed' & set claimedSpots
    await db
      .update(campaignAllocation)
      .set({
        claimedSpots: validWallets.length,
        status: 'completed',
        submittedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(campaignAllocation.id, data.allocationId));


    // Update target campaign claimedSpots count
    await db
      .update(campaign)
      .set({
        claimedSpots: sql`${campaign.claimedSpots} + ${validWallets.length}`,
        updatedAt: new Date(),
      })
      .where(eq(campaign.id, data.campaignId));

    // Auto-close campaign if total claimed spots reaches capacity
    const [updatedCmp] = await db.select().from(campaign).where(eq(campaign.id, data.campaignId));
    if (updatedCmp && (updatedCmp.claimedSpots || 0) >= updatedCmp.totalSpots) {
      await db
        .update(campaign)
        .set({
          status: 'closed',
          updatedAt: new Date(),
        })
        .where(eq(campaign.id, data.campaignId));
    }

    // Fetch target campaign details for notification
    const [cmpRecord] = await db.select().from(campaign).where(eq(campaign.id, data.campaignId));
    const [cmWs] = await db.select().from(workspace).where(eq(workspace.id, data.communityWorkspaceId));

    if (cmpRecord) {
      // 1. Notify Project Lead (Wallets Received & Deal Completed)
      await createInAppNotification({
        workspaceId: cmpRecord.workspaceId,
        title: "🎉 Wallet Sheet Submitted & Deal Completed",
        message: `${cmWs?.name || 'Community'} submitted ${validWallets.length} member wallets for '${cmpRecord.title}'. Deal is fully completed!`,
        type: "allocation",
        link: "/project/collaborations",
      });
    }

    // 2. Notify CM / Community Workspace (Deal Completed Confirmation)
    await createInAppNotification({
      workspaceId: data.communityWorkspaceId,
      title: "✓ Deal Fully Completed",
      message: `You successfully submitted ${validWallets.length} wallets for '${cmpRecord?.title || 'the campaign'}'.`,
      type: "allocation",
      link: "/community/collaborations",
    });

    revalidatePath('/community/collaborations');
    revalidatePath('/cm/collaborations');
    revalidatePath('/project/collaborations');
    revalidatePath('/project/applications');

    return { success: true, count: validWallets.length };
  } catch (error: any) {
    console.error('Error submitting bulk wallets:', error);
    return { success: false, error: error?.message || 'Failed to submit wallet sheet' };
  }
}

