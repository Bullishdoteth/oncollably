import { Redis } from "@upstash/redis"

const redisUrl = process.env.UPSTASH_REDIS_REST_URL
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN

// Fail-safe check: only initialize if credentials exist
export const redis =
  redisUrl && redisToken
    ? new Redis({
        url: redisUrl,
        token: redisToken,
      })
    : null

/**
 * Resilient Redis Get with Fail-Open fallback
 */
export async function redisGet<T>(key: string): Promise<T | null> {
  if (!redis) return null
  try {
    return await redis.get<T>(key)
  } catch (error) {
    console.warn(`[Redis Fail-Open] GET key "${key}" failed:`, error)
    return null
  }
}

/**
 * Resilient Redis Set with optional TTL (in seconds)
 */
export async function redisSet<T>(key: string, value: T, ttlSeconds?: number): Promise<boolean> {
  if (!redis) return false
  try {
    if (ttlSeconds && ttlSeconds > 0) {
      await redis.set(key, value, { ex: ttlSeconds })
    } else {
      await redis.set(key, value)
    }
    return true
  } catch (error) {
    console.warn(`[Redis Fail-Open] SET key "${key}" failed:`, error)
    return false
  }
}

/**
 * Resilient Redis Delete
 */
export async function redisDel(key: string): Promise<boolean> {
  if (!redis) return false
  try {
    await redis.del(key)
    return true
  } catch (error) {
    console.warn(`[Redis Fail-Open] DEL key "${key}" failed:`, error)
    return false
  }
}
