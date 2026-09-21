import React, { useEffect, useRef, useState } from 'react'
import { useI18n } from '../../i18n/i18n'
import { attachArchifyIframeObserver } from './deferredArchifyObserver'

type Props = {
  src: string
  title: string
}

/** Mount Archify HTML only when the slot is near the viewport. Keep it once shown. */
export const DeferredArchifyIframe: React.FC<Props> = ({ src, title }) => {
  const { t } = useI18n()
  const slotRef = useRef<HTMLDivElement | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    if (inView) return
    const node = slotRef.current
    if (!node) return
    return attachArchifyIframeObserver(node, () => setInView(true))
  }, [inView])

  return (
    <div ref={slotRef} className="archify-iframe-slot" style={{ width: '100%', height: '100%' }}>
      {inView ? (
        <iframe
          src={src}
          title={title}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            display: 'block',
          }}
        />
      ) : (
        <p
          className="archify-iframe-pending"
          role="status"
          style={{
            margin: 0,
            padding: '1.25rem',
            color: 'var(--muted)',
            fontSize: '0.88rem',
            lineHeight: 1.5,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem',
            height: '100%',
            justifyContent: 'center',
          }}
        >
          <strong>{title}</strong>
          <span>{t('cs.archify.iframe.pending')}</span>
        </p>
      )}
    </div>
  )
}
