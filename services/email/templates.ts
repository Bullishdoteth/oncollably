/**
 * Responsive HTML email templates for Oncollably transactional emails
 */

export function welcomeWorkspaceTemplate({
  name,
  workspaceName,
  workspaceType,
}: {
  name: string
  workspaceName: string
  workspaceType: string
}) {
  const typeTitle =
    workspaceType === "project"
      ? "Web3 Project Workspace"
      : workspaceType === "community"
      ? "Community Hub"
      : "Collab Manager Workspace"

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Oncollably</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; border: 1px solid #e4e4e7; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #09090b; padding: 32px; text-align: center;">
              <h1 style="color: #ffffff; font-size: 24px; font-weight: 800; margin: 0;">Oncollably</h1>
              <p style="color: #a1a1aa; font-size: 13px; margin: 6px 0 0 0; text-transform: uppercase; letter-spacing: 1.5px;">Web3 Collaboration Platform</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 32px; color: #18181b;">
              <h2 style="font-size: 20px; font-weight: 700; margin: 0 0 16px 0;">Welcome, ${name || "Creator"}!</h2>
              <p style="font-size: 14px; line-height: 1.6; color: #52525b; margin: 0 0 20px 0;">
                Your workspace <strong style="color: #09090b;">${workspaceName}</strong> (${typeTitle}) has been successfully created on Oncollably.
              </p>

              <div style="background-color: #fafafa; border: 1px solid #f4f4f5; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                <h3 style="font-size: 14px; font-weight: 700; margin: 0 0 8px 0; color: #09090b;">What you can do next:</h3>
                <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #52525b; line-height: 1.8;">
                  <li>Launch whitelist allocation campaigns</li>
                  <li>Receive collab applications from top Web3 communities</li>
                  <li>Export verified wallet address entries cleanly</li>
                </ul>
              </div>

              <div style="text-align: center; margin-top: 32px;">
                <a href="https://oncollably.com" style="display: inline-block; background-color: #09090b; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; padding: 14px 28px; border-radius: 10px;">Go to Dashboard &rarr;</a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #fafafa; border-top: 1px solid #f4f4f5; padding: 20px 32px; text-align: center; font-size: 12px; color: #a1a1aa;">
              &copy; ${new Date().getFullYear()} Oncollably. All rights reserved.<br>
              Need help? Reach us at oncollably@newnaija.ng
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

export function collabApplicationSubmittedTemplate({
  projectTitle,
  communityName,
  requestedSpots,
  pitchMessage,
}: {
  projectTitle: string
  communityName: string
  requestedSpots: number
  pitchMessage?: string
}) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Collab Application</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; border: 1px solid #e4e4e7; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
          
          <tr>
            <td style="background-color: #09090b; padding: 28px; text-align: center;">
              <h1 style="color: #ffffff; font-size: 20px; font-weight: 800; margin: 0;">Oncollably</h1>
              <p style="color: #10b981; font-size: 12px; font-weight: 700; margin: 4px 0 0 0; text-transform: uppercase;">New Collab Application Received</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 32px; color: #18181b;">
              <h2 style="font-size: 18px; font-weight: 700; margin: 0 0 16px 0;">New Application for ${projectTitle}</h2>
              <p style="font-size: 14px; line-height: 1.6; color: #52525b; margin: 0 0 20px 0;">
                <strong style="color: #09090b;">${communityName}</strong> has submitted a collab application requesting <strong style="color: #10b981;">${requestedSpots} Whitelist Spots</strong>.
              </p>

              ${
                pitchMessage
                  ? `
              <div style="background-color: #fafafa; border-left: 4px solid #09090b; padding: 16px; margin-bottom: 24px; font-style: italic; font-size: 13px; color: #3f3f46;">
                "${pitchMessage}"
              </div>
              `
                  : ""
              }

              <div style="text-align: center; margin-top: 24px;">
                <a href="https://oncollably.com/project/applications" style="display: inline-block; background-color: #09090b; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 600; padding: 12px 24px; border-radius: 10px;">Review Application &rarr;</a>
              </div>
            </td>
          </tr>

          <tr>
            <td style="background-color: #fafafa; border-top: 1px solid #f4f4f5; padding: 20px; text-align: center; font-size: 12px; color: #a1a1aa;">
              &copy; ${new Date().getFullYear()} Oncollably &bull; oncollably@newnaija.ng
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

export function campaignCreatedTemplate({
  campaignTitle,
  totalSpots,
  allocationType,
  ecosystem,
}: {
  campaignTitle: string
  totalSpots: number
  allocationType: string
  ecosystem: string
}) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Campaign Launched</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; border: 1px solid #e4e4e7; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
          
          <tr>
            <td style="background-color: #09090b; padding: 28px; text-align: center;">
              <h1 style="color: #ffffff; font-size: 20px; font-weight: 800; margin: 0;">Oncollably</h1>
              <p style="color: #3b82f6; font-size: 12px; font-weight: 700; margin: 4px 0 0 0; text-transform: uppercase;">Campaign Successfully Launched</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 32px; color: #18181b;">
              <h2 style="font-size: 18px; font-weight: 700; margin: 0 0 16px 0;">${campaignTitle} is Live!</h2>
              <p style="font-size: 14px; line-height: 1.6; color: #52525b; margin: 0 0 20px 0;">
                Your campaign <strong style="color: #09090b;">${campaignTitle}</strong> is now open for partner applications with <strong style="color: #3b82f6;">${totalSpots} ${allocationType.toUpperCase()} Whitelist Spots</strong> on ${ecosystem}.
              </p>

              <div style="text-align: center; margin-top: 24px;">
                <a href="https://oncollably.com/project/campaigns" style="display: inline-block; background-color: #09090b; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 600; padding: 12px 24px; border-radius: 10px;">Manage Campaign &rarr;</a>
              </div>
            </td>
          </tr>

          <tr>
            <td style="background-color: #fafafa; border-top: 1px solid #f4f4f5; padding: 20px; text-align: center; font-size: 12px; color: #a1a1aa;">
              &copy; ${new Date().getFullYear()} Oncollably &bull; oncollably@newnaija.ng
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

export function applicationStatusChangedTemplate({
  status,
  projectTitle,
  campaignTitle,
  requestedSpots,
}: {
  status: "accepted" | "rejected"
  projectTitle: string
  campaignTitle: string
  requestedSpots: number
}) {
  const isAccepted = status === "accepted"
  const color = isAccepted ? "#10b981" : "#ef4444"

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Application Update</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; border: 1px solid #e4e4e7; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
          
          <tr>
            <td style="background-color: #09090b; padding: 28px; text-align: center;">
              <h1 style="color: #ffffff; font-size: 20px; font-weight: 800; margin: 0;">Oncollably</h1>
              <p style="color: ${color}; font-size: 12px; font-weight: 700; margin: 4px 0 0 0; text-transform: uppercase;">
                Application ${isAccepted ? "Accepted & Granted" : "Reviewed"}
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding: 32px; color: #18181b;">
              <h2 style="font-size: 18px; font-weight: 700; margin: 0 0 16px 0;">
                ${isAccepted ? "🎉 Congratulations!" : "Application Status Update"}
              </h2>
              <p style="font-size: 14px; line-height: 1.6; color: #52525b; margin: 0 0 20px 0;">
                Your request to <strong style="color: #09090b;">${projectTitle}</strong> for <strong style="color: ${color};">${requestedSpots} Whitelist Spots</strong> on <em>${campaignTitle}</em> has been <strong style="color: ${color};">${status.toUpperCase()}</strong>.
              </p>

              <div style="text-align: center; margin-top: 24px;">
                <a href="https://oncollably.com/community/collaborations" style="display: inline-block; background-color: #09090b; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 600; padding: 12px 24px; border-radius: 10px;">View Collaborations &rarr;</a>
              </div>
            </td>
          </tr>

          <tr>
            <td style="background-color: #fafafa; border-top: 1px solid #f4f4f5; padding: 20px; text-align: center; font-size: 12px; color: #a1a1aa;">
              &copy; ${new Date().getFullYear()} Oncollably &bull; oncollably@newnaija.ng
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

export function walletEntrySubmittedTemplate({
  campaignTitle,
  walletAddress,
}: {
  campaignTitle: string
  walletAddress: string
}) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Wallet Entry Confirmation</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; border: 1px solid #e4e4e7; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
          
          <tr>
            <td style="background-color: #09090b; padding: 28px; text-align: center;">
              <h1 style="color: #ffffff; font-size: 20px; font-weight: 800; margin: 0;">Oncollably</h1>
              <p style="color: #10b981; font-size: 12px; font-weight: 700; margin: 4px 0 0 0; text-transform: uppercase;">Whitelist Entry Confirmed</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 32px; color: #18181b;">
              <h2 style="font-size: 18px; font-weight: 700; margin: 0 0 16px 0;">Entry Confirmed for ${campaignTitle}</h2>
              <p style="font-size: 14px; line-height: 1.6; color: #52525b; margin: 0 0 20px 0;">
                Your wallet address <code style="background-color: #f4f4f5; padding: 4px 8px; font-family: monospace; border-radius: 4px; color: #09090b;">${walletAddress}</code> has been registered for <strong style="color: #09090b;">${campaignTitle}</strong>.
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color: #fafafa; border-top: 1px solid #f4f4f5; padding: 20px; text-align: center; font-size: 12px; color: #a1a1aa;">
              &copy; ${new Date().getFullYear()} Oncollably &bull; oncollably@newnaija.ng
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}
