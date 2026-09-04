import { db } from "@/lib/db/db"
import { notification } from "@/lib/db/schema"
import { eq, desc, and } from "drizzle-orm"
import { notificationBus } from "./event-bus"

export interface CreateNotificationParams {
  userId?: string
  workspaceId?: string
  title: string
  message: string
  type?: "application" | "allocation" | "campaign" | "system" | "entry"
  link?: string
}

/**
 * Create In-App Notification & Broadcast via Real-time Stream
 */
export async function createInAppNotification(params: CreateNotificationParams) {
  try {
    const id = `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
    const createdAt = new Date()

    await db.insert(notification).values({
      id,
      userId: params.userId || null,
      workspaceId: params.workspaceId || null,
      title: params.title,
      message: params.message,
      type: params.type || "info",
      read: false,
      link: params.link || null,
      createdAt,
    })

    // Instant real-time broadcast without DB polling
    notificationBus.broadcast({
      id,
      userId: params.userId || null,
      workspaceId: params.workspaceId || null,
      title: params.title,
      message: params.message,
      type: params.type || "info",
      read: false,
      link: params.link || null,
      createdAt: createdAt.toISOString(),
    })

    return { success: true, notificationId: id }
  } catch (error) {
    console.error("Error creating in-app notification:", error)
    return { success: false }
  }
}

/**
 * Get Notifications for Workspace / User
 */
export async function getWorkspaceNotifications(workspaceId?: string, userId?: string) {
  try {
    if (workspaceId) {
      return await db
        .select()
        .from(notification)
        .where(eq(notification.workspaceId, workspaceId))
        .orderBy(desc(notification.createdAt))
        .limit(30)
    }

    if (userId) {
      return await db
        .select()
        .from(notification)
        .where(eq(notification.userId, userId))
        .orderBy(desc(notification.createdAt))
        .limit(30)
    }

    return await db.select().from(notification).orderBy(desc(notification.createdAt)).limit(30)
  } catch (error) {
    console.error("Error fetching workspace notifications:", error)
    return []
  }
}

/**
 * Mark a single Notification as read
 */
export async function markNotificationAsRead(id: string) {
  try {
    await db
      .update(notification)
      .set({ read: true })
      .where(eq(notification.id, id))
    return { success: true }
  } catch (error) {
    console.error("Error marking notification as read:", error)
    return { success: false }
  }
}

/**
 * Mark all notifications as read for a workspace
 */
export async function markAllNotificationsAsRead(workspaceId: string) {
  try {
    await db
      .update(notification)
      .set({ read: true })
      .where(and(eq(notification.workspaceId, workspaceId), eq(notification.read, false)))
    return { success: true }
  } catch (error) {
    console.error("Error marking all notifications as read:", error)
    return { success: false }
  }
}
