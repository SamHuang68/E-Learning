import React, { useRef, useState, useEffect } from 'react'
import { useI18n } from '../i18n/i18n'
import type { MessageKey } from '../i18n/messages'
import './scratchpad.css'

interface Props {
  id?: string
  isOpen: boolean
  onClose: () => void
}

const PEN_COLORS: { hex: string; labelKey: MessageKey }[] = [
  { hex: '#38bdf8', labelKey: 'scratch.color.cyan' },
  { hex: '#facc15', labelKey: 'scratch.color.yellow' },
  { hex: '#f43f5e', labelKey: 'scratch.color.red' },
  { hex: '#ffffff', labelKey: 'scratch.color.white' },
]

/**
 * 手寫幾何與算式推導草稿紙 (Interactive Scratchpad)
 * 提供純前端 HTML5 Canvas 塗鴉推導板，支援高對比暗色網格、多色筆刷、橡皮擦與一鍵清空。
 */
export const Scratchpad: React.FC<Props> = ({ id = 'hub-scratchpad', isOpen, onClose }) => {
  const { t, locale } = useI18n()
  const dialogRef = useRef<HTMLDialogElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState('#38bdf8')
  const [lineWidth] = useState(2.5)
  const [isEraser, setIsEraser] = useState(false)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!isOpen || !dialog) return
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null
    dialog.showModal()
    dialog.querySelector<HTMLButtonElement>('.scratchpad-close')?.focus()
    return () => {
      if (dialog.open) dialog.close()
      if (opener?.isConnected) opener?.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    canvas.width = (rect.width || 400) * (window.devicePixelRatio || 1)
    canvas.height = (rect.height || 240) * (window.devicePixelRatio || 1)
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1)

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
    const transform = ctx.getTransform()
    drawGrid(ctx, canvas.width / transform.a, canvas.height / transform.d)
  }

  function getPos(e: React.MouseEvent | React.TouchEvent) {
    if (!canvasRef.current) return { x: 0, y: 0 }
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const transform = canvas.getContext('2d')?.getTransform()
    // Retain the existing drawing when the viewport changes, while keeping
    // pointer coordinates aligned with the resized on-screen canvas.
    const scaleX = canvas.width / (rect.width || 1) / (transform?.a || 1)
    const scaleY = canvas.height / (rect.height || 1) / (transform?.d || 1)
    if ('touches' in e && e.touches.length > 0) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      }
    }
    const me = e as React.MouseEvent
    return {
      x: (me.clientX - rect.left) * scaleX,
      y: (me.clientY - rect.top) * scaleY,
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
    <dialog
      ref={dialogRef}
      id={id}
      className="scratchpad-overlay"
      aria-modal="true"
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-instructions`}
      lang={locale}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onKeyDown={(event) => event.stopPropagation()}
    >
      <div className="scratchpad-header">
        <h2 id={`${id}-title`}><span aria-hidden="true">✏️ </span>{t('scratch.title')}</h2>
        <button
          type="button"
          className="scratchpad-close"
          onClick={onClose}
          aria-label={t('scratch.close')}
          title={t('scratch.close')}
        >
          <span aria-hidden="true">✕</span>
        </button>
        <div className="scratchpad-tools" role="group" aria-label={t('scratch.tools')}>
          {PEN_COLORS.map((pen) => (
            <button
              key={pen.hex}
              type="button"
              className="scratchpad-color"
              onClick={() => { setColor(pen.hex); setIsEraser(false); }}
              aria-pressed={!isEraser && color === pen.hex}
              aria-label={t(pen.labelKey)}
              title={t(pen.labelKey)}
            >
              <span aria-hidden="true" style={{ background: pen.hex }} />
            </button>
          ))}
          <button
            type="button"
            aria-pressed={isEraser}
            onClick={() => setIsEraser(!isEraser)}
          >
            {t('scratch.eraser')}
          </button>
          <button
            type="button"
            onClick={handleClear}
          >
            {t('scratch.clear')}
          </button>
        </div>
      </div>
      <p id={`${id}-instructions`} className="scratchpad-instructions">{t('scratch.instructions')}</p>

      <canvas
        ref={canvasRef}
        aria-label={t('scratch.canvas')}
        role="img"
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={stopDraw}
        onMouseLeave={stopDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={stopDraw}
        onTouchCancel={stopDraw}
        style={{
          cursor: isEraser ? 'cell' : 'crosshair',
        }}
      />
    </dialog>
  )
}
