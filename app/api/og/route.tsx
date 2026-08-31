import { ImageResponse } from "next/og"

export const runtime = "nodejs"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const title = searchParams.get("title") || "Oncollably — Web3 Collaboration Engine"
    const description =
      searchParams.get("description") ||
      "Manage collaboration applications, verify communities, allocate whitelist spots, and track every deal in one unified dashboard."
    const badge = searchParams.get("badge") || "Web3 Collab Engine"

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "space-between",
            backgroundColor: "#09090b",
            color: "#ffffff",
            padding: "60px 70px",
            fontFamily: "sans-serif",
            backgroundImage:
              "radial-gradient(circle at 85% 15%, rgba(16, 185, 129, 0.18), transparent 45%), radial-gradient(circle at 15% 85%, rgba(99, 102, 241, 0.18), transparent 45%)",
          }}
        >
          {/* Header row: Brand Logo & Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            {/* Brand Logo */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: "#ffffff",
                  color: "#000000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 900,
                  fontSize: "20px",
                }}
              >
                O
              </div>
              <span
                style={{
                  fontSize: "30px",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  color: "#ffffff",
                }}
              >
                Oncollably
              </span>
            </div>

            {/* Badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 18px",
                borderRadius: "9999px",
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.18)",
                fontSize: "15px",
                fontWeight: 600,
                color: "#10b981",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "#10b981",
                }}
              />
              <span>{badge}</span>
            </div>
          </div>

          {/* Main Title & Description */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              maxWidth: "1020px",
            }}
          >
            <h1
              style={{
                fontSize: "54px",
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: "-0.03em",
                color: "#ffffff",
                margin: 0,
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: "22px",
                color: "#a1a1aa",
                lineHeight: 1.45,
                margin: 0,
              }}
            >
              {description}
            </p>
          </div>

          {/* Footer Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              borderTop: "1px solid rgba(255, 255, 255, 0.12)",
              paddingTop: "24px",
              color: "#71717a",
              fontSize: "16px",
              fontWeight: 500,
            }}
          >
            <span>oncollably.com</span>
            <span>Verified Web3 Collaboration Platform</span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: any) {
    return new Response(`Failed to generate OpenGraph image: ${e.message}`, {
      status: 500,
    })
  }
}
