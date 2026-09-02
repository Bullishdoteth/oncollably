import { VerificationCheckResult } from "./types";

/**
 * Service: Project Verification
 * Evaluates whether a project workspace satisfies verification criteria:
 * 1. COMPULSORY: Project Access Pass ($10 creation fee paid / active status)
 * 2. ANY ONE OF: X account connected, Discord server connected, or Personal Website connected.
 */
export function verifyProjectWorkspace(workspace: any): VerificationCheckResult {
  if (!workspace) {
    return {
      isVerified: false,
      badgeLabel: "Unverified Project",
      badgeType: "unverified",
      checks: {
        accessPassPaid: false,
        xConnected: false,
        discordConnected: false,
        websiteConnected: false,
      },
      passedChecksCount: 0,
      hasRequiredPass: false,
      hasSocialVerification: false,
      missingRequirements: [
        "Project Access Pass ($10) compulsory",
        "At least one social or website link (X, Discord, or Website)",
      ],
    };
  }

  // 1. Compulsory Check: Project Access Pass Paid ($10 / active status)
  const accessPassPaid = Boolean(
    workspace.paid === true ||
    workspace.status === "active" ||
    (workspace.type === "project" && (workspace.paid || workspace.status === "active"))
  );

  // 2. Social / Web Verification Checks (Any 1 required)
  const twitterVal = typeof workspace.twitter === "string" ? workspace.twitter.trim() : "";
  const discordVal = typeof workspace.discord === "string" ? workspace.discord.trim() : "";
  const websiteVal = typeof workspace.website === "string" ? workspace.website.trim() : "";

  const xConnected = Boolean(twitterVal && twitterVal.length > 0 && twitterVal !== "null");
  const discordConnected = Boolean(discordVal && discordVal.length > 0 && discordVal !== "null");
  const websiteConnected = Boolean(websiteVal && websiteVal.length > 0 && websiteVal !== "null");

  const hasSocialVerification = xConnected || discordConnected || websiteConnected;

  // Verification Decision: Compulsory Access Pass + At least one Social/Web check
  const isVerified = accessPassPaid && hasSocialVerification;

  const missingRequirements: string[] = [];
  if (!accessPassPaid) {
    missingRequirements.push("Project Access Pass ($10)");
  }
  if (!hasSocialVerification) {
    missingRequirements.push("At least one verification link (X account, Discord, or Personal Website)");
  }

  let passedCount = 0;
  if (accessPassPaid) passedCount++;
  if (xConnected) passedCount++;
  if (discordConnected) passedCount++;
  if (websiteConnected) passedCount++;

  return {
    isVerified,
    badgeLabel: isVerified ? "Verified Project" : "Unverified Project",
    badgeType: isVerified ? "verified" : "unverified",
    checks: {
      accessPassPaid,
      xConnected,
      discordConnected,
      websiteConnected,
    },
    passedChecksCount: passedCount,
    hasRequiredPass: accessPassPaid,
    hasSocialVerification,
    missingRequirements,
  };
}
