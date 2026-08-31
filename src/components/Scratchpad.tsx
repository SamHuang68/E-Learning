import React, { useRef, useState, useEffect } from 'react'

interface Props {
  isOpen: boolean
  onClose: () => void
}

/**
 * 手寫幾何與算式推導草稿紙 (Interactive Scratchpad)
 * 提供純前端 HTML5 Canvas 塗鴉推導板，支援高對比暗色網格、多色筆刷、橡皮擦與一鍵清空。
 */
export const Scratchpad: React.FC<Props> = ({ isOpen, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState('#38bdf8') // 預設青藍色高對比筆刷
  const [lineWidth] = useState(2.5)
  const [isEraser, setIsEraser] = useState(false)

  useEffect(() => {
    if (!isOpen || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 確保高解析度適配
    const rect = canvas.getBoundingClientRect()
    canvas.width = (rect.width || 400) * (window.devicePixelRatio || 1)
    canvas.height = (rect.height || 240) * (window.devicePixelRatio || 1)
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1)

    // 繪製微弱坐標輔助網格
    drawGrid(ctx, rect.width || 400, rect.height || 240)
  }, [isOpen])

  function drawGrid(ctx: CanvasRenderingContext2D, width: number, height: number) {
    ctx.clearRect(0, 0, width, height)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
    ctx.lineWidth = 1
    const gridSize = 20

    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }
  }

  function handleClear() {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const rect = canvas.getBoundingClientRect()
    drawGrid(ctx, rect.width || 400, rect.height || 240)
  }

  function getPos(e: React.MouseEvent | React.TouchEvent) {
    if (!canvasRef.current) return { x: 0, y: 0 }
    const rect = canvasRef.current.getBoundingClientRect()
    if ('touches' in e && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      }
    }
    const me = e as React.MouseEvent
    return {
      x: me.clientX - rect.left,
      y: me.clientY - rect.top,
    }
  }

  function startDraw(e: React.MouseEvent | React.TouchEvent) {
    setIsDrawing(true)
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    const pos = getPos(e)
    ctx.beginPath()
    ctx.moveTo(pos.x, pos.y)
  }

  function draw(e: React.MouseEvent | React.TouchEvent) {
    if (!isDrawing || !canvasRef.current) return
    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return
    const pos = getPos(e)
    ctx.strokeStyle = isEraser ? '#0f172a' : color
    ctx.lineWidth = isEraser ? 16 : lineWidth
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
  }

  function stopDraw() {
    setIsDrawing(false)
  }

  if (!isOpen) return null

  return (
    <div
      className="scratchpad-overlay"
      style={{
        position: 'fixed',
        bottom: '1rem',
        right: '1rem',
        width: 'min(420px, 94vw)',
        background: '#0f172a',
        border: '1px solid #334155',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* 頂部工具列 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.4rem 0.65rem',
          background: '#1e293b',
          borderBottom: '1px solid #334155',
        }}
      >
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          ✏️ 幾何草稿紙
        </span>
        <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
          {['#38bdf8', '#facc15', '#f43f5e', '#ffffff'].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => { setColor(c); setIsEraser(false); }}
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: c,
                border: !isEraser && color === c ? '2px solid #fff' : '1px solid rgba(255,255,255,0.3)',
                cursor: 'pointer',
                padding: 0,
              }}
              title="選擇顏色"
            />
          ))}
          <button
            type="button"
            className="pill-btn"
            style={{ fontSize: '0.68rem', padding: '0.15rem 0.4rem', background: isEraser ? 'rgba(239, 68, 68, 0.3)' : undefined }}
            onClick={() => setIsEraser(!isEraser)}
          >
            {isEraser ? '橡皮擦中' : '橡皮擦'}
          </button>
          <button
            type="button"
            className="pill-btn"
            style={{ fontSize: '0.68rem', padding: '0.15rem 0.4rem' }}
            onClick={handleClear}
          >
            清空
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1rem', cursor: 'pointer', marginLeft: '0.2rem' }}
            title="關閉草稿紙"
          >
            ✕
          </button>
        </div>
      </div>

      {/* 畫布區域 */}
      <canvas
        ref={canvasRef}
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={stopDraw}
        onMouseLeave={stopDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={stopDraw}
        style={{
          width: '100%',
          height: '240px',
          background: '#0b1329',
          cursor: isEraser ? 'cell' : 'crosshair',
          touchAction: 'none',
          display: 'block',
        }}
      />
    </div>
  )
}
