import { EventEmitter } from "events"

class NotificationEventBus extends EventEmitter {
  constructor() {
    super()
    this.setMaxListeners(200)
  }

  broadcast(notification: {
    id: string
    workspaceId?: string | null
    userId?: string | null
    title: string
    message: string
    type: string
    read: boolean
    link?: string | null
    createdAt: Date | string
  }) {
    this.emit("notification", notification)
  }
}

// Singleton instance across Node server execution
export const notificationBus = (globalThis as any)._notificationBus || new NotificationEventBus()
if (process.env.NODE_ENV !== "production") {
  ;(globalThis as any)._notificationBus = notificationBus
}
