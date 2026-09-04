import { db } from './db';
import {
  workspace,
  campaign,
  campaignAllocation,
  application,
  entry,
  cmPortfolio,
  teamMember,
  communityRepresentative,
  user,
} from './schema';
import { eq, and, desc, or } from 'drizzle-orm';

/**
 * Workspaces
 */
export async function getUserWorkspaces(userId: string) {
  try {
    return await db.select().from(workspace).where(eq(workspace.userId, userId));
  } catch (error) {
    console.error('Error fetching user workspaces:', error);
    return [];
  }
}

export async function getWorkspaceByHandle(handle: string) {
  try {
    const cleanHandle = handle.replace(/^@/, '');
    const [res] = await db
      .select()
      .from(workspace)
      .where(or(eq(workspace.handle, cleanHandle), eq(workspace.id, cleanHandle)));
    return res || null;
  } catch (error) {
    console.error('Error fetching workspace by handle:', error);
    return null;
  }
}

export async function getWorkspaceById(id: string) {
  try {
    const [res] = await db.select().from(workspace).where(eq(workspace.id, id));
    return res || null;
  } catch (error) {
    console.error('Error fetching workspace by ID:', error);
    return null;
  }
}

export async function getWorkspacesByType(type: 'project' | 'community' | 'cm') {
  try {
    return await db.select().from(workspace).where(eq(workspace.type, type)).orderBy(desc(workspace.createdAt));
  } catch (error) {
    console.error('Error fetching workspaces by type:', error);
    return [];
  }
}

/**
 * Campaigns
 */
export async function getCampaignsForWorkspace(workspaceId: string) {
  try {
    return await db
      .select()
      .from(campaign)
      .where(eq(campaign.workspaceId, workspaceId))
      .orderBy(desc(campaign.createdAt));
  } catch (error) {
    console.error('Error fetching workspace campaigns:', error);
    return [];
  }
}

export async function getAllActiveCampaigns() {
  try {
    const campaigns = await db
      .select({
        campaign: campaign,
        workspace: workspace,
      })
      .from(campaign)
      .innerJoin(workspace, eq(campaign.workspaceId, workspace.id))
      .where(eq(campaign.status, 'active'))
      .orderBy(desc(campaign.createdAt));

    return campaigns.map((row) => ({
      ...row.campaign,
      workspaceName: row.workspace.name,
      workspaceHandle: row.workspace.handle,
      workspaceType: row.workspace.type,
    }));
  } catch (error) {
    console.error('Error fetching all active campaigns:', error);
    return [];
  }
}

export async function getCampaignBySlugOrId(slugOrId: string) {
  try {
    const [res] = await db
      .select({
        campaign: campaign,
        workspace: workspace,
      })
      .from(campaign)
      .innerJoin(workspace, eq(campaign.workspaceId, workspace.id))
      .where(or(eq(campaign.slug, slugOrId), eq(campaign.id, slugOrId)));

    if (!res) return null;

    return {
      ...res.campaign,
      workspace: res.workspace,
    };
  } catch (error) {
    console.error('Error fetching campaign by slug or id:', error);
    return null;
  }
}

export async function getCampaignByProjectAndSlug(projectHandle: string, campaignSlug: string) {
  try {
    const cleanHandle = projectHandle.replace(/^@/, '');
    const [res] = await db
      .select({
        campaign: campaign,
        workspace: workspace,
      })
      .from(campaign)
      .innerJoin(workspace, eq(campaign.workspaceId, workspace.id))
      .where(
        and(
          or(eq(workspace.handle, cleanHandle), eq(workspace.id, cleanHandle)),
          or(eq(campaign.slug, campaignSlug), eq(campaign.id, campaignSlug))
        )
      );

    if (!res) return null;

    return {
      campaign: res.campaign,
      workspace: res.workspace,
    };
  } catch (error) {
    console.error('Error fetching campaign by project and slug:', error);
    return null;
  }
}

/**
 * Applications & Allocations
 */
export async function getApplicationsForProject(projectWorkspaceId: string) {
  try {
    const rows = await db
      .select({
        application: application,
        campaign: campaign,
        applicantWorkspace: workspace,
      })
      .from(application)
      .innerJoin(campaign, eq(application.campaignId, campaign.id))
      .innerJoin(workspace, eq(application.applicantWorkspaceId, workspace.id))
      .where(eq(campaign.workspaceId, projectWorkspaceId))
      .orderBy(desc(application.createdAt));

    return rows.map((r) => ({
      ...r.application,
      campaignTitle: r.campaign.title,
      applicantName: r.application.representedCommunityName || r.applicantWorkspace.name,
      applicantHandle: r.applicantWorkspace.handle,
      applicantType: r.application.representedCommunityType || r.applicantWorkspace.type,
      discordMemberCount: r.application.discordMemberCount || r.applicantWorkspace.discordMemberCount || 12500,
      xFollowerCount: r.application.xFollowerCount || r.applicantWorkspace.xFollowerCount || 45000,
      xHandle: r.application.xHandle || r.applicantWorkspace.twitter || `@${r.applicantWorkspace.handle}`,
      discordInvite: r.application.discordInvite || r.applicantWorkspace.discord || 'discord.gg/community',
    }));
  } catch (error) {
    console.error('Error fetching applications for project:', error);
    return [];
  }
}

export async function getApplicationsForApplicant(applicantWorkspaceId: string) {
  try {
    const rows = await db
      .select({
        application: application,
        campaign: campaign,
        projectWorkspace: workspace,
      })
      .from(application)
      .innerJoin(campaign, eq(application.campaignId, campaign.id))
      .innerJoin(workspace, eq(campaign.workspaceId, workspace.id))
      .where(eq(application.applicantWorkspaceId, applicantWorkspaceId))
      .orderBy(desc(application.createdAt));

    return rows.map((r) => ({
      ...r.application,
      campaignTitle: r.campaign.title,
      projectName: r.projectWorkspace.name,
      projectHandle: r.projectWorkspace.handle,
    }));
  } catch (error) {
    console.error('Error fetching applicant applications:', error);
    return [];
  }
}

export async function getCollaborationsForCommunity(communityWorkspaceId: string) {
  try {
    const rows = await db
      .select({
        allocation: campaignAllocation,
        campaign: campaign,
        projectWorkspace: workspace,
      })
      .from(campaignAllocation)
      .innerJoin(campaign, eq(campaignAllocation.campaignId, campaign.id))
      .innerJoin(workspace, eq(campaign.workspaceId, workspace.id))
      .where(eq(campaignAllocation.communityWorkspaceId, communityWorkspaceId))
      .orderBy(desc(campaignAllocation.createdAt));

    const result = [];
    for (const r of rows) {
      const entries = await db
        .select()
        .from(entry)
        .where(
          or(
            eq(entry.allocationId, r.allocation.id),
            and(
              eq(entry.campaignId, r.allocation.campaignId),
              eq(entry.submittedByWorkspaceId, communityWorkspaceId)
            )
          )
        )
        .orderBy(desc(entry.submittedAt));

      const claimedSpots = entries.length > 0 ? entries.length : r.allocation.claimedSpots;

      result.push({
        ...r.allocation,
        campaignTitle: r.campaign.title,
        campaignSlug: r.campaign.slug,
        ecosystem: r.campaign.ecosystem,
        projectName: r.projectWorkspace.name,
        projectHandle: r.projectWorkspace.handle,
        deadline: r.allocation.deadline || r.campaign.walletSubmissionDeadline,
        claimedSpots,
        status: claimedSpots >= r.allocation.allocatedSpots ? 'completed' : r.allocation.status,
        entries: entries.map((e) => ({
          id: e.id,
          walletAddress: e.walletAddress,
          discordTag: e.discordTag || '',
          xHandle: e.xHandle || '',
          submittedAt: e.submittedAt,
        })),
      });
    }

    return result;
  } catch (error) {
    console.error('Error fetching collaborations for community:', error);
    return [];
  }
}

export async function getCollaborationsForProject(projectWorkspaceId: string) {
  try {
    const rows = await db
      .select({
        allocation: campaignAllocation,
        campaign: campaign,
        applicantWorkspace: workspace,
      })
      .from(campaignAllocation)
      .innerJoin(campaign, eq(campaignAllocation.campaignId, campaign.id))
      .innerJoin(workspace, eq(campaignAllocation.communityWorkspaceId, workspace.id))
      .where(eq(campaign.workspaceId, projectWorkspaceId))
      .orderBy(desc(campaignAllocation.createdAt));

    const result: any[] = [];

    for (const r of rows) {
      const entries = await db
        .select()
        .from(entry)
        .where(
          or(
            eq(entry.allocationId, r.allocation.id),
            and(
              eq(entry.campaignId, r.allocation.campaignId),
              eq(entry.submittedByWorkspaceId, r.allocation.communityWorkspaceId)
            )
          )
        )
        .orderBy(desc(entry.submittedAt));

      const claimedSpots = entries.length > 0 ? entries.length : r.allocation.claimedSpots;

      result.push({
        id: r.allocation.id,
        campaignId: r.campaign.id,
        campaignTitle: r.campaign.title,
        campaignSlug: r.campaign.slug,
        ecosystem: r.campaign.ecosystem || 'Solana',
        communityWorkspaceId: r.allocation.communityWorkspaceId,
        applicantName: r.applicantWorkspace.name,
        applicantHandle: r.applicantWorkspace.handle,
        representedCommunityName: r.applicantWorkspace.name,
        requestedSpots: r.allocation.allocatedSpots,
        allocatedSpots: r.allocation.allocatedSpots,
        claimedSpots,
        status: claimedSpots >= r.allocation.allocatedSpots ? 'completed' : r.allocation.status,
        deadline: r.allocation.deadline || r.campaign.walletSubmissionDeadline,
        createdAt: r.allocation.createdAt,
        entries: entries.map((e) => ({
          id: e.id,
          walletAddress: e.walletAddress,
          discordTag: e.discordTag || '',
          xHandle: e.xHandle || '',
          submittedAt: e.submittedAt,
        })),
      });
    }

    // Fallback for accepted applications in application table without allocation rows
    const appRows = await db
      .select({
        application: application,
        campaign: campaign,
        applicantWorkspace: workspace,
      })
      .from(application)
      .innerJoin(campaign, eq(application.campaignId, campaign.id))
      .innerJoin(workspace, eq(application.applicantWorkspaceId, workspace.id))
      .where(
        and(
          eq(campaign.workspaceId, projectWorkspaceId),
          or(eq(application.status, 'accepted'), eq(application.status, 'completed'))
        )
      );

    for (const app of appRows) {
      const exists = result.some(
        (res) =>
          res.campaignId === app.campaign.id &&
          res.communityWorkspaceId === app.application.applicantWorkspaceId
      );
      if (!exists) {
        const entries = await db
          .select()
          .from(entry)
          .where(
            and(
              eq(entry.campaignId, app.campaign.id),
              eq(entry.submittedByWorkspaceId, app.application.applicantWorkspaceId)
            )
          )
          .orderBy(desc(entry.submittedAt));

        const reqSpots = app.application.requestedSpots || 10;
        result.push({
          id: app.application.id,
          campaignId: app.campaign.id,
          campaignTitle: app.campaign.title,
          campaignSlug: app.campaign.slug,
          ecosystem: app.campaign.ecosystem || 'Solana',
          communityWorkspaceId: app.application.applicantWorkspaceId,
          applicantName: app.application.representedCommunityName || app.applicantWorkspace.name,
          applicantHandle: app.applicantWorkspace.handle,
          representedCommunityName: app.application.representedCommunityName || app.applicantWorkspace.name,
          requestedSpots: reqSpots,
          allocatedSpots: reqSpots,
          claimedSpots: entries.length,
          status: entries.length >= reqSpots ? 'completed' : 'accepted',
          deadline: app.application.deadline,
          createdAt: app.application.createdAt,
          entries: entries.map((e) => ({
            id: e.id,
            walletAddress: e.walletAddress,
            discordTag: e.discordTag || '',
            xHandle: e.xHandle || '',
            submittedAt: e.submittedAt,
          })),
        });
      }
    }

    return result;
  } catch (error) {
    console.error('Error fetching collaborations for project:', error);
    return [];
  }
}

export async function getMasterWalletEntriesForCampaign(campaignId: string) {
  try {
    const rows = await db
      .select({
        entry: entry,
        communityWorkspace: workspace,
      })
      .from(entry)
      .leftJoin(workspace, eq(entry.submittedByWorkspaceId, workspace.id))
      .where(eq(entry.campaignId, campaignId))
      .orderBy(desc(entry.submittedAt));

    return rows.map((r) => ({
      id: r.entry.id,
      walletAddress: r.entry.walletAddress,
      discordTag: r.entry.discordTag || '',
      xHandle: r.entry.xHandle || '',
      communityName: r.communityWorkspace?.name || 'Partner Community',
      cmHandle: r.communityWorkspace?.handle ? `@${r.communityWorkspace.handle}` : '',
      submittedAt: r.entry.submittedAt,
    }));
  } catch (error) {
    console.error('Error fetching master wallet entries:', error);
    return [];
  }
}


/**
 * CM Portfolios
 */
export async function getCmPortfolioItems(userId?: string, workspaceId?: string) {
  try {
    if (workspaceId && userId) {
      return await db
        .select()
        .from(cmPortfolio)
        .where(or(eq(cmPortfolio.workspaceId, workspaceId), eq(cmPortfolio.userId, userId)))
        .orderBy(desc(cmPortfolio.createdAt));
    }
    if (workspaceId) {
      return await db
        .select()
        .from(cmPortfolio)
        .where(eq(cmPortfolio.workspaceId, workspaceId))
        .orderBy(desc(cmPortfolio.createdAt));
    }
    if (userId) {
      return await db
        .select()
        .from(cmPortfolio)
        .where(eq(cmPortfolio.userId, userId))
        .orderBy(desc(cmPortfolio.createdAt));
    }
    return await db.select().from(cmPortfolio).orderBy(desc(cmPortfolio.createdAt));
  } catch (error) {
    console.error('Error fetching CM portfolio items:', error);
    return [];
  }
}

/**
 * Entries
 */
export async function getCampaignEntries(campaignId: string) {
  try {
    return await db
      .select()
      .from(entry)
      .where(eq(entry.campaignId, campaignId))
      .orderBy(desc(entry.submittedAt));
  } catch (error) {
    console.error('Error fetching campaign entries:', error);
    return [];
  }
}

/**
 * Team Members
 */
export async function getTeamMembers(workspaceId: string) {
  try {
    return await db
      .select()
      .from(teamMember)
      .where(eq(teamMember.workspaceId, workspaceId))
      .orderBy(desc(teamMember.createdAt));
  } catch (error) {
    console.error('Error fetching team members:', error);
    return [];
  }
}

export async function getCommunityRepresentatives(communityWorkspaceId: string) {
  try {
    return await db
      .select()
      .from(communityRepresentative)
      .where(eq(communityRepresentative.communityWorkspaceId, communityWorkspaceId))
      .orderBy(desc(communityRepresentative.createdAt));
  } catch (error) {
    console.error('Error fetching community representatives:', error);
    return [];
  }
}
