export interface CampaignRequirements {
  minDiscordMembers?: number | null;
  minXFollowers?: number | null;
  minCmExperienceYears?: number | null;
  requireDiscordVerification?: boolean | null;
  requireXVerification?: boolean | null;
  allowedCommunityTypes?: string | null;
  customRequirements?: string | null;
}

export interface ApplicantMetrics {
  discordMemberCount?: number;
  xFollowerCount?: number;
  cmExperienceYears?: number;
  discordInvite?: string;
  xHandle?: string;
  communityType?: string;
}

export interface VettingResult {
  vettingStatus: 'passed' | 'failed' | 'warning';
  passedCount: number;
  totalCriteria: number;
  failedReasons: string[];
  passedCriteria: string[];
}

export function evaluateVettingRequirements(
  requirements: CampaignRequirements,
  applicant: ApplicantMetrics
): VettingResult {
  const failedReasons: string[] = [];
  const passedCriteria: string[] = [];
  let totalCriteria = 0;

  // 1. Min Discord Members
  if (requirements.minDiscordMembers && requirements.minDiscordMembers > 0) {
    totalCriteria++;
    const count = applicant.discordMemberCount || 0;
    if (count >= requirements.minDiscordMembers) {
      passedCriteria.push(`Discord Members (${count.toLocaleString()} >= ${requirements.minDiscordMembers.toLocaleString()} min)`);
    } else {
      failedReasons.push(`Insufficient Discord Members (${count.toLocaleString()} < ${requirements.minDiscordMembers.toLocaleString()} min)`);
    }
  }

  // 2. Min X Followers
  if (requirements.minXFollowers && requirements.minXFollowers > 0) {
    totalCriteria++;
    const count = applicant.xFollowerCount || 0;
    if (count >= requirements.minXFollowers) {
      passedCriteria.push(`X Followers (${count.toLocaleString()} >= ${requirements.minXFollowers.toLocaleString()} min)`);
    } else {
      failedReasons.push(`Insufficient X Followers (${count.toLocaleString()} < ${requirements.minXFollowers.toLocaleString()} min)`);
    }
  }

  // 3. Min CM Experience
  if (requirements.minCmExperienceYears && requirements.minCmExperienceYears > 0) {
    totalCriteria++;
    const exp = applicant.cmExperienceYears || 1;
    if (exp >= requirements.minCmExperienceYears) {
      passedCriteria.push(`CM Experience (${exp} yr >= ${requirements.minCmExperienceYears} yr min)`);
    } else {
      failedReasons.push(`Insufficient CM Experience (${exp} yr < ${requirements.minCmExperienceYears} yr min)`);
    }
  }

  // 4. Require Discord Link
  if (requirements.requireDiscordVerification) {
    totalCriteria++;
    if (applicant.discordInvite && applicant.discordInvite.trim().length > 0) {
      passedCriteria.push('Discord Server Invite provided');
    } else {
      failedReasons.push('Missing Discord Server Invite Link');
    }
  }

  // 5. Require X Handle
  if (requirements.requireXVerification) {
    totalCriteria++;
    if (applicant.xHandle && applicant.xHandle.trim().length > 0) {
      passedCriteria.push('X / Twitter Handle provided');
    } else {
      failedReasons.push('Missing X / Twitter Handle');
    }
  }

  // 6. Allowed Community Types
  if (requirements.allowedCommunityTypes && requirements.allowedCommunityTypes.trim().length > 0) {
    totalCriteria++;
    const allowedList = requirements.allowedCommunityTypes
      .split(',')
      .map((t) => t.trim().toLowerCase());
    const applicantType = (applicant.communityType || 'DAO').trim().toLowerCase();

    if (allowedList.length === 0 || allowedList.includes(applicantType) || allowedList.includes('all')) {
      passedCriteria.push(`Community Type matched (${applicant.communityType || 'DAO'})`);
    } else {
      failedReasons.push(`Community type '${applicant.communityType || 'DAO'}' not in allowed list (${requirements.allowedCommunityTypes})`);
    }
  }

  const passedCount = passedCriteria.length;
  let vettingStatus: 'passed' | 'failed' | 'warning' = 'passed';

  if (totalCriteria === 0) {
    return {
      vettingStatus: 'passed',
      passedCount: 0,
      totalCriteria: 0,
      failedReasons: [],
      passedCriteria: ['No specific requirement checks set'],
    };
  }

  if (failedReasons.length > 0) {
    vettingStatus = 'failed';
  } else {
    vettingStatus = 'passed';
  }

  return {
    vettingStatus,
    passedCount,
    totalCriteria,
    failedReasons,
    passedCriteria,
  };
}
