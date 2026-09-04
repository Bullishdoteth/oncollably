import { NextRequest } from "next/server"
import { notificationBus } from "@/services/notifications/event-bus"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const workspaceId = searchParams.get("workspaceId")

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder()

      // Send initial heartbeat
      controller.enqueue(encoder.encode(": heartbeat\n\n"))

      const onNotification = (notif: any) => {
        if (!workspaceId || notif.workspaceId === workspaceId || notif.workspaceId === "global") {
          const data = `data: ${JSON.stringify(notif)}\n\n`
          controller.enqueue(encoder.encode(data))
        }
      }

      notificationBus.on("notification", onNotification)

      // Send heartbeat every 20 seconds to keep connection alive
      const interval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": heartbeat\n\n"))
        } catch {
          clearInterval(interval)
        }
      }, 20000)

      request.signal.addEventListener("abort", () => {
        notificationBus.off("notification", onNotification)
        clearInterval(interval)
      })
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  })
}
