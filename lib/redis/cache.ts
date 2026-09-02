import { redisGet, redisSet, redisDel } from "./redis"

const CACHE_TTL = 3600 // 1 hour TTL in seconds

export interface CachedWorkspace {
  id: string
  handle: string
  name: string
  type: string
  role?: string
}

export interface CachedUserSession {
  userId: string
  workspaceType: string
  handle: string
}

/**
 * Get cached user workspaces list
 */
export async function getCachedUserWorkspaces(userId: string): Promise<CachedWorkspace[] | null> {
  return redisGet<CachedWorkspace[]>(`user:workspaces:${userId}`)
}

/**
 * Store user workspaces in Redis cache
 */
export async function setCachedUserWorkspaces(userId: string, workspaces: CachedWorkspace[]): Promise<boolean> {
  return redisSet(`user:workspaces:${userId}`, workspaces, CACHE_TTL)
}

/**
 * Get cached active workspace selection
 */
export async function getCachedActiveWorkspace(userId: string): Promise<CachedUserSession | null> {
  return redisGet<CachedUserSession>(`user:active-workspace:${userId}`)
}

/**
 * Set cached active workspace selection
 */
export async function setCachedActiveWorkspace(
  userId: string,
  session: CachedUserSession
): Promise<boolean> {
  return redisSet(`user:active-workspace:${userId}`, session, CACHE_TTL)
}

/**
 * Invalidate all Redis cached state for a user (called on workspace switch or profile update)
 */
export async function invalidateUserCache(userId: string): Promise<void> {
  await Promise.all([
    redisDel(`user:workspaces:${userId}`),
    redisDel(`user:active-workspace:${userId}`),
    redisDel(`user:session:${userId}`),
  ])
}
