export type ContentManifest = {
  version: string
  updatedAt: string
  packs: string[]
}

function baseUrl(path: string): string {
  const base = import.meta.env.BASE_URL || '/'
  return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url)
    if (response.status === 404) return null
    if (!response.ok) return null
    return (await response.json()) as T
  } catch {
    return null
  }
}

export async function fetchContentManifest(): Promise<ContentManifest | null> {
  return fetchJson<ContentManifest>(baseUrl('content/manifest.json'))
}

export async function loadRemotePack(name: string): Promise<unknown | null> {
  const fileName = name.endsWith('.json') ? name : `${name}.json`
  return fetchJson<unknown>(baseUrl(`content/${fileName}`))
}
