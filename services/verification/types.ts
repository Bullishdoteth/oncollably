export interface VerificationCheckDetails {
  accessPassPaid: boolean;
  xConnected: boolean;
  discordConnected: boolean;
  websiteConnected: boolean;
}

export interface VerificationCheckResult {
  isVerified: boolean;
  badgeLabel: string;
  badgeType: "verified" | "unverified";
  checks: VerificationCheckDetails;
  passedChecksCount: number;
  hasRequiredPass: boolean;
  hasSocialVerification: boolean;
  missingRequirements: string[];
}
