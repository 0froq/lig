import { IMAGE_ORIGIN, SITE_ORIGIN } from '#shared/site'

export { IMAGE_ORIGIN, SITE_ORIGIN } from '#shared/site'

export const OG_IMAGE_PATH = '/og.png'
export const OG_IMAGE_URL = absoluteImageUrl(OG_IMAGE_PATH)
export const OG_IMAGE_WIDTH = 1200
export const OG_IMAGE_HEIGHT = 630

/** Absolute canonical URL for a route path (`/` or `/zh/docs`). */
export function canonicalUrl(path: string): string {
  if (!path || path === '/')
    return SITE_ORIGIN
  return `${SITE_ORIGIN}${path.replace(/\/+$/, '')}`
}

/** Absolute https URL for a share image. Already-absolute https URLs pass through. */
export function absoluteImageUrl(src: string): string {
  if (/^https:\/\//i.test(src))
    return src
  const path = src.startsWith('/') ? src : `/${src}`
  return `${IMAGE_ORIGIN}${path}`
}
