export const getCache = async <T>(key: string): Promise<T | null> => {
  const storage = useStorage()
  const entry = await storage.getItem<{ value: T, expiresAt: number }>(`cache:${key}`)

  if (!entry) return null
  if (Date.now() > entry.expiresAt) {
    await storage.removeItem(`cache:${key}`)
    return null
  }

  return entry.value
}

export const setCache = async <T>(key: string, value: T, ttlSeconds: number): Promise<void> => {
  const storage = useStorage()
  const expiresAt = Date.now() + ttlSeconds * 1000
  await storage.setItem(`cache:${key}`, { value, expiresAt })
}

export const clearCache = async (key: string): Promise<void> => {
  const storage = useStorage()
  await storage.removeItem(`cache:${key}`)
}
