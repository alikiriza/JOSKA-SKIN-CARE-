import { Redis } from "@upstash/redis";

const redis = new Redis({ url: process.env.UPSTASH_REDIS_REST_URL!, token: process.env.UPSTASH_REDIS_REST_TOKEN! });

export async function getCachedOrFetch<T>(key: string, fetcher: () => Promise<T>, ttl = 60): Promise<T> {
  const cached = await redis.get<T>(key);
  if (cached) return cached;
  const data = await fetcher();
  await redis.setex(key, ttl, data);
  return data;
}

export async function invalidateTag(pattern: string) {
  const keys = await redis.keys(pattern);
  if (keys.length > 0) await redis.del(...keys);
}

export const tags = {
  products: "products:*",
  categories: "categories:*",
  orders: "orders:*",
  analytics: "analytics:*",
};
