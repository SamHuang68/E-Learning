import React, { useState } from 'react'
import { playCorrectSound } from '../../engine/audioSynthesizer'

interface Props {
  onEarnXp: (amount: number) => void
}

export const CacheMappingLab: React.FC<Props> = ({ onEarnXp }) => {
  const [cacheSizeKB, setCacheSizeKB] = useState<number>(32)
  const [lineSizeBytes, setLineSizeBytes] = useState<number>(64)
  const [ways, setWays] = useState<number>(8)
  const [hexAddress, setHexAddress] = useState<string>('0040A5C8')
  const [hasClaimedXp, setHasClaimedXp] = useState<boolean>(false)

  // 計算位址位元劃分
  const totalSizeBytes = cacheSizeKB * 1024
  const offsetBits = Math.round(Math.log2(lineSizeBytes))
  const numSets = totalSizeBytes / (ways * lineSizeBytes)
  const indexBits = Math.round(Math.log2(numSets))
  const tagBits = 32 - indexBits - offsetBits

  // 解析使用者輸入的 32-bit 整數
  const parsedAddress = parseInt(hexAddress.replace(/^0x/i, ''), 16) || 0
  const offsetMask = (1 << offsetBits) - 1
  const offsetVal = parsedAddress & offsetMask

  const indexMask = (numSets - 1)
  const indexVal = (parsedAddress >>> offsetBits) & indexMask

  const tagVal = parsedAddress >>> (offsetBits + indexBits)

  function handleRandomAddress() {
    const randomVal = Math.floor(Math.random() * 0xffffffff)
    setHexAddress(randomVal.toString(16).toUpperCase().padStart(8, '0'))
  }

  function handleClaimXp() {
    if (hasClaimedXp) return
    playCorrectSound()
    onEarnXp(15)
    setHasClaimedXp(true)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%', overflowY: 'auto', paddingRight: '0.4rem' }}>
      {/* 頂部標題與控制卡片 */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>💾</span> 組相聯快取位址映射 (Cache Mapping) 實驗室
          </h3>
          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.76rem', color: 'var(--muted)' }}>
            輸入 32-bit 位址，即時分解 [Tag 標籤 | Index 組索引 | Offset 塊內位移] 並模擬比對
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button
            type="button"
            onClick={handleRandomAddress}
            style={{
              background: 'var(--surface-soft)',
              color: 'var(--text)',
              border: '1px solid var(--line)',
              borderRadius: '8px',
              padding: '0.35rem 0.85rem',
              fontSize: '0.76rem',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            🎲 隨機位址
          </button>

          {!hasClaimedXp ? (
            <button
              type="button"
              onClick={handleClaimXp}
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '0.35rem 0.85rem',
                fontSize: '0.76rem',
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              領取 +15 XP
            </button>
          ) : (
            <span style={{ fontSize: '0.74rem', color: '#10b981', fontWeight: 700 }}>✓ 已掌握 +15 XP</span>
          )}
        </div>
      </div>

      {/* 參數微調與輸入區 */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div>
          <label style={{ fontSize: '0.76rem', color: 'var(--muted)', display: 'block', marginBottom: '0.3rem' }}>
            快取總容量 (Cache Size):
          </label>
          <div style={{ display: 'flex', gap: '0.3rem' }}>
            {[16, 32, 64].map((sz) => (
              <button
                key={sz}
                type="button"
                onClick={() => setCacheSizeKB(sz)}
                style={{
                  flex: 1,
                  background: cacheSizeKB === sz ? '#2563eb' : 'var(--surface-soft)',
                  color: cacheSizeKB === sz ? '#fff' : 'var(--text)',
                  border: '1px solid var(--line)',
                  borderRadius: '6px',
                  padding: '0.3rem 0.5rem',
                  fontSize: '0.74rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                {sz} KB
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ fontSize: '0.76rem', color: 'var(--muted)', display: 'block', marginBottom: '0.3rem' }}>
            關聯路數 (Associativity):
          </label>
          <div style={{ display: 'flex', gap: '0.3rem' }}>
            {[1, 2, 4, 8].map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => setWays(w)}
                style={{
                  flex: 1,
                  background: ways === w ? '#2563eb' : 'var(--surface-soft)',
                  color: ways === w ? '#fff' : 'var(--text)',
                  border: '1px solid var(--line)',
                  borderRadius: '6px',
                  padding: '0.3rem 0.5rem',
                  fontSize: '0.74rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                {w === 1 ? '直接' : `${w}-Way`}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ fontSize: '0.76rem', color: 'var(--muted)', display: 'block', marginBottom: '0.3rem' }}>
            快取行大小 (Line Size):
          </label>
          <div style={{ display: 'flex', gap: '0.3rem' }}>
            {[32, 64].map((ls) => (
              <button
                key={ls}
                type="button"
                onClick={() => setLineSizeBytes(ls)}
                style={{
                  flex: 1,
                  background: lineSizeBytes === ls ? '#2563eb' : 'var(--surface-soft)',
                  color: lineSizeBytes === ls ? '#fff' : 'var(--text)',
                  border: '1px solid var(--line)',
                  borderRadius: '6px',
                  padding: '0.3rem 0.5rem',
                  fontSize: '0.74rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                {ls} Bytes
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ fontSize: '0.76rem', color: 'var(--muted)', display: 'block', marginBottom: '0.3rem' }}>
            32-bit 十六進位位址 (0x):
          </label>
          <input
            type="text"
            value={hexAddress}
            onChange={(e) => setHexAddress(e.target.value.toUpperCase())}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              background: 'var(--surface-soft)',
              color: 'var(--text)',
              border: '1px solid var(--line)',
              borderRadius: '6px',
              padding: '0.3rem 0.6rem',
              fontSize: '0.8rem',
              fontFamily: 'monospace',
              fontWeight: 700,
            }}
          />
        </div>
      </div>

      {/* 位址分段長條圖與數值解析 */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#2563eb' }}>
          📐 32 位元位址欄位拆分長條圖 (Total 32 Bits)
        </span>

        {/* 視覺化彩色分段長條 */}
        <div style={{ display: 'flex', width: '100%', height: '36px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--line)', fontFamily: 'monospace', fontWeight: 700, fontSize: '0.76rem', color: '#fff' }}>
          <div style={{ flex: tagBits, background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'flex 0.3s ease' }}>
            Tag: {tagBits} bits
          </div>
          <div style={{ flex: indexBits, background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'flex 0.3s ease' }}>
            Index: {indexBits} bits
          </div>
          <div style={{ flex: offsetBits, background: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'flex 0.3s ease' }}>
            Offset: {offsetBits} bits
          </div>
        </div>

        {/* 三大欄位詳細數值卡片 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
          <div style={{ background: 'var(--surface-soft)', borderLeft: '4px solid #3b82f6', borderRadius: '8px', padding: '0.6rem 0.8rem' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--muted)', display: 'block' }}>Tag (標籤位元)</span>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#3b82f6', fontFamily: 'monospace' }}>
              0x{tagVal.toString(16).toUpperCase()}
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>共 {tagBits} 位元，用於組內比對</span>
          </div>

          <div style={{ background: 'var(--surface-soft)', borderLeft: '4px solid #10b981', borderRadius: '8px', padding: '0.6rem 0.8rem' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--muted)', display: 'block' }}>Set Index (組號)</span>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#10b981', fontFamily: 'monospace' }}>
              Set #{indexVal} (0x{indexVal.toString(16).toUpperCase()})
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>共 {numSets} 組 (Sets)</span>
          </div>

          <div style={{ background: 'var(--surface-soft)', borderLeft: '4px solid #f59e0b', borderRadius: '8px', padding: '0.6rem 0.8rem' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--muted)', display: 'block' }}>Byte Offset (塊內位移)</span>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f59e0b', fontFamily: 'monospace' }}>
              {offsetVal} Bytes (0x{offsetVal.toString(16).toUpperCase()})
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>定位 64B 快取行內的精確位元組</span>
          </div>
        </div>
      </div>
    </div>
  )
}
