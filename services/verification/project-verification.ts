import { VerificationCheckResult } from "./types";

/**
 * Service: Project Verification
 * Evaluates whether a project workspace satisfies verification criteria:
 * 1. Free Platform Access (Default Active)
 * 2. ANY ONE OF: X account connected, Discord server connected, or Personal Website connected.
 */
export function verifyProjectWorkspace(workspace: any): VerificationCheckResult {
  if (!workspace) {
    return {
      isVerified: false,
      badgeLabel: "Unverified Project",
      badgeType: "unverified",
      checks: {
        accessPassPaid: true,
        xConnected: false,
        discordConnected: false,
        websiteConnected: false,
      },
      passedChecksCount: 0,
      hasRequiredPass: true,
      hasSocialVerification: false,
      missingRequirements: [
        "At least one social or website link (X, Discord, or Website)",
      ],
    };
  }

  // 1. Free Access Pass Status (Always active on free platform)
  const accessPassPaid = true;

  // 2. Social / Web Verification Checks (Any 1 required)
  const twitterVal = typeof workspace.twitter === "string" ? workspace.twitter.trim() : "";
  const discordVal = typeof workspace.discord === "string" ? workspace.discord.trim() : "";
  const websiteVal = typeof workspace.website === "string" ? workspace.website.trim() : "";

  const xConnected = Boolean(twitterVal && twitterVal.length > 0 && twitterVal !== "null");
  const discordConnected = Boolean(discordVal && discordVal.length > 0 && discordVal !== "null");
  const websiteConnected = Boolean(websiteVal && websiteVal.length > 0 && websiteVal !== "null");

  const hasSocialVerification = xConnected || discordConnected || websiteConnected;

  // Verification Decision: At least one Social/Web check required
  const isVerified = hasSocialVerification;

  const missingRequirements: string[] = [];
  if (!hasSocialVerification) {
    missingRequirements.push("At least one verification link (X account, Discord, or Personal Website)");
  }

  let passedCount = 0;
  if (xConnected) passedCount++;
  if (discordConnected) passedCount++;
  if (websiteConnected) passedCount++;

  return {
    isVerified,
    badgeLabel: isVerified ? "Verified Project" : "Unverified Project",
    badgeType: isVerified ? "verified" : "unverified",
    checks: {
      accessPassPaid: true,
      xConnected,
      discordConnected,
      websiteConnected,
    },
    passedChecksCount: passedCount,
    hasRequiredPass: true,
    hasSocialVerification,
    missingRequirements,
  };
}
