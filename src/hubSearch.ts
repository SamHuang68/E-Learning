export type HubSearchableTrack = {
  id: string
  title: string
  desc: string
  catalog: string
  pill: string
}

export function filterHubTracks<T extends HubSearchableTrack>(tracks: T[], query: string): T[] {
  const needle = query.trim().toLowerCase()
  if (!needle) return tracks
  return tracks.filter((track) =>
    [track.id, track.title, track.desc, track.catalog, track.pill].some((field) =>
      field.toLowerCase().includes(needle),
    ),
  )
}
