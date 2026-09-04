import { resend, DEFAULT_FROM_EMAIL } from "./resend"
import {
  welcomeWorkspaceTemplate,
  collabApplicationSubmittedTemplate,
  campaignCreatedTemplate,
  applicationStatusChangedTemplate,
  walletEntrySubmittedTemplate,
} from "./templates"

export interface SendEmailPayload {
  to: string | string[]
  subject: string
  html: string
  text?: string
  from?: string
}

/**
 * Generic email sender using Resend API with graceful logging fallback
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
  from = DEFAULT_FROM_EMAIL,
}: SendEmailPayload) {
  try {
    const apiKey = process.env.RESEND_API_KEY

    if (!apiKey || apiKey.startsWith("re_dummy")) {
      console.log(`[Email Service Dev Fallback] Resend API key missing or dummy. Email simulated:`)
      console.log(`- From: ${from}`)
      console.log(`- To: ${Array.isArray(to) ? to.join(", ") : to}`)
      console.log(`- Subject: ${subject}`)
      return { success: true, simulated: true, id: `sim_${Date.now()}` }
    }

    const response = await resend.emails.send({
      from,
      to,
      subject,
      html,
      text,
    })

    if (response.error) {
      console.error("[Resend Error]:", response.error)
      return { success: false, error: response.error.message }
    }

    return { success: true, id: response.data?.id }
  } catch (error: any) {
    console.error("[Email Service Exception]:", error)
    return { success: false, error: error?.message || "Failed to send email" }
  }
}

/**
 * Send Welcome Email on Workspace Creation
 */
export async function sendWorkspaceWelcomeEmail({
  to,
  name,
  workspaceName,
  workspaceType,
}: {
  to: string
  name: string
  workspaceName: string
  workspaceType: string
}) {
  const html = welcomeWorkspaceTemplate({ name, workspaceName, workspaceType })
  return sendEmail({
    to,
    subject: `Welcome to Oncollably - ${workspaceName} created!`,
    html,
  })
}

/**
 * Send Application Notification Email to Project Lead
 */
export async function sendCollabApplicationNotificationEmail({
  to,
  projectTitle,
  communityName,
  requestedSpots,
  pitchMessage,
}: {
  to: string
  projectTitle: string
  communityName: string
  requestedSpots: number
  pitchMessage?: string
}) {
  const html = collabApplicationSubmittedTemplate({
    projectTitle,
    communityName,
    requestedSpots,
    pitchMessage,
  })

  return sendEmail({
    to,
    subject: `New Collab Application from ${communityName} for ${projectTitle}`,
    html,
  })
}

/**
 * Send Campaign Launch Email
 */
export async function sendCampaignCreatedEmail({
  to,
  campaignTitle,
  totalSpots,
  allocationType,
  ecosystem,
}: {
  to: string
  campaignTitle: string
  totalSpots: number
  allocationType: string
  ecosystem: string
}) {
  const html = campaignCreatedTemplate({
    campaignTitle,
    totalSpots,
    allocationType,
    ecosystem,
  })

  return sendEmail({
    to,
    subject: `Campaign Launched: ${campaignTitle}`,
    html,
  })
}

/**
 * Send Application Status Update Email (Accepted / Rejected)
 */
export async function sendApplicationStatusEmail({
  to,
  status,
  projectTitle,
  campaignTitle,
  requestedSpots,
}: {
  to: string
  status: "accepted" | "rejected"
  projectTitle: string
  campaignTitle: string
  requestedSpots: number
}) {
  const html = applicationStatusChangedTemplate({
    status,
    projectTitle,
    campaignTitle,
    requestedSpots,
  })

  return sendEmail({
    to,
    subject: `Application ${status === "accepted" ? "Accepted" : "Update"} - ${projectTitle}`,
    html,
  })
}

/**
 * Send Wallet Entry Confirmation Email
 */
export async function sendWalletEntryEmail({
  to,
  campaignTitle,
  walletAddress,
}: {
  to: string
  campaignTitle: string
  walletAddress: string
}) {
  const html = walletEntrySubmittedTemplate({
    campaignTitle,
    walletAddress,
  })

  return sendEmail({
    to,
    subject: `Whitelist Entry Confirmed - ${campaignTitle}`,
    html,
  })
}

export { resend, DEFAULT_FROM_EMAIL }
