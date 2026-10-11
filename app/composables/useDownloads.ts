export type DownloadStatus = 'idle' | 'pending' | 'started' | 'error'

/** Per-file state shared across components and client navigation, reset on reload. */
export function useDownloads() {
  const states = useState<Record<string, DownloadStatus>>('lig-downloads', () => ({}))

  function statusFor(href: string): DownloadStatus {
    return states.value[href] ?? 'idle'
  }

  function reset(href: string): void {
    if (statusFor(href) !== 'pending')
      delete states.value[href]
  }

  async function start(href: string, filename: string): Promise<void> {
    if (!import.meta.client || statusFor(href) === 'pending')
      return

    states.value[href] = 'pending'
    let objectUrl: string | undefined
    let link: HTMLAnchorElement | undefined
    try {
      const response = await fetch(href)
      if (!response.ok)
        throw new Error(`Download request failed: ${response.status}`)
      objectUrl = URL.createObjectURL(await response.blob())
      link = document.createElement('a')
      link.href = objectUrl
      link.download = filename
      link.hidden = true
      document.body.append(link)
      link.click()
      // Native downloads expose no disk-save completion event to the page.
      states.value[href] = 'started'
    }
    catch {
      states.value[href] = 'error'
    }
    finally {
      link?.remove()
      if (objectUrl) {
        const url = objectUrl
        // Give the browser time to consume the Blob before releasing it.
        setTimeout(() => URL.revokeObjectURL(url), 30_000)
      }
    }
  }

  return { states: readonly(states), statusFor, start, reset }
}
