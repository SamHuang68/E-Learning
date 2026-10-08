import React, { useId, useState } from 'react'
import { useI18n } from '../i18n/i18n'
import {
  getLsmGlossaryCopy,
  isLsmTooltipVisible,
  type LsmGlossaryTermKey,
} from './lsmGlossaryCopy'

interface Props {
  termKey: LsmGlossaryTermKey
  children: React.ReactNode
}

export const LsmGlossaryTooltip: React.FC<Props> = ({ termKey, children }) => {
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const { locale } = useI18n()
  const copy = getLsmGlossaryCopy(locale, termKey)
  const tooltipId = useId()
  const show = isLsmTooltipVisible({ hovered, focused, dismissed })

  return (
    <span
      style={{ position: 'relative', cursor: 'help', borderBottom: '1px dotted var(--accent, #6366f1)' }}
      onMouseEnter={() => {
        setHovered(true)
        setDismissed(false)
      }}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => {
        setFocused(true)
        setDismissed(false)
      }}
      onBlur={() => setFocused(false)}
      onKeyDown={(event) => {
        if (event.key === 'Escape') setDismissed(true)
      }}
      tabIndex={0}
      aria-label={copy.label}
      aria-describedby={show ? tooltipId : undefined}
    >
      {children}
      {show && (
        <div
          id={tooltipId}
          role="tooltip"
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--card-bg, #1e293b)',
            color: 'var(--text)',
            padding: '0.5rem 0.75rem',
            borderRadius: '6px',
            fontSize: '0.75rem',
            whiteSpace: 'pre-wrap',
            maxWidth: '320px',
            zIndex: 100,
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            border: '1px solid var(--line)',
          }}
        >
          <strong>{copy.heading}</strong>
          {copy.definitions.map((definition) => (
            <React.Fragment key={definition}>
              <br />
              {definition}
            </React.Fragment>
          ))}
        </div>
      )}
    </span>
  )
}
