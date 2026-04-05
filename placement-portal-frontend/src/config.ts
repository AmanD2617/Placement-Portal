// Centralized configuration — change these when deploying to production
export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api'
export const API_ORIGIN = import.meta.env.VITE_API_ORIGIN || 'http://localhost:3000'

/**
 * Resolves a file path (e.g. "/uploads/avatars/user-1.jpg") to a full URL.
 * If the path is already a full URL (e.g. from Cloudinary), returns it as-is.
 * Returns null if no path is provided.
 */
export function resolveFileUrl(filePath: string | null | undefined): string | null {
  if (!filePath) return null
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) return filePath
  return `${API_ORIGIN}${filePath}`
}
