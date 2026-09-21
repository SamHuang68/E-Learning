import { describe, expect, it } from 'vitest'
import { filterHubTracks } from './hubSearch'

const tracks = [
  { id: 'math', title: '臺灣數學', desc: '國小到高中', catalog: '題庫', pill: 'K-12' },
  { id: 'ja', title: '日語', desc: 'JLPT', catalog: '五十音', pill: '中文學日文' },
  { id: 'en', title: '多益英語', desc: '商務語塊', catalog: '聽力', pill: '中文解說' },
]

describe('filterHubTracks', () => {
  it('returns all tracks when the query is empty', () => {
    expect(filterHubTracks(tracks, '  ')).toEqual(tracks)
  })

  it('matches title, catalog, or id', () => {
    expect(filterHubTracks(tracks, '數學').map((t) => t.id)).toEqual(['math'])
    expect(filterHubTracks(tracks, '五十音').map((t) => t.id)).toEqual(['ja'])
    expect(filterHubTracks(tracks, 'EN')).toEqual([tracks[2]])
  })

  it('returns an empty list for a miss so the Hub can show catalog links', () => {
    expect(filterHubTracks(tracks, 'zzzz-no-hit')).toEqual([])
  })
})
