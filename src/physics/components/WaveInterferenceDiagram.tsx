import { useI18n } from '../../i18n/i18n'

/** Teaching-only Young double-slit sketch. Not a lab measurement. */
export function WaveInterferenceDiagram() {
  const { t } = useI18n()
  return (
    <figure className="wave-interference-figure">
      <svg
        className="wave-interference-svg"
        viewBox="0 0 320 148"
        role="img"
        aria-labelledby="wave-int-title"
        aria-describedby="wave-int-desc"
      >
        <title id="wave-int-title">{t('physics.interference.altTitle')}</title>
        <desc id="wave-int-desc">{t('physics.interference.altDesc')}</desc>
        <rect x="8" y="16" width="18" height="116" fill="var(--surface-soft, #1e293b)" stroke="var(--line, #334155)" />
        <rect x="14" y="44" width="8" height="10" fill="#facc15" />
        <rect x="14" y="94" width="8" height="10" fill="#facc15" />
        <text x="12" y="40" fill="currentColor" fontSize="8">S1</text>
        <text x="12" y="90" fill="currentColor" fontSize="8">S2</text>
        <path
          d="M26 49 Q 90 40 170 28 T 268 20"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="1.2"
          opacity="0.85"
        />
        <path
          d="M26 99 Q 90 92 170 80 T 268 70"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="1.2"
          opacity="0.85"
        />
        <path
          d="M26 49 Q 110 72 268 74"
          fill="none"
          stroke="#a78bfa"
          strokeWidth="1.1"
          strokeDasharray="3 2"
          opacity="0.9"
        />
        <rect x="268" y="16" width="40" height="116" fill="#0b1329" stroke="#475569" />
        {[20, 32, 44, 56, 68, 80, 92, 104, 116].map((y, i) => (
          <rect
            key={y}
            x="272"
            y={y}
            width="32"
            height="10"
            fill={i % 2 === 0 ? '#f8fafc' : '#1e293b'}
            opacity={i % 2 === 0 ? 0.95 : 0.9}
          />
        ))}
        <text x="40" y="138" fill="currentColor" fontSize="9">
          {t('physics.interference.svgNote')}
        </text>
      </svg>
      <figcaption>
        <strong>{t('physics.interference.caption')}</strong>
        <span>{t('physics.interference.honesty')}</span>
      </figcaption>
    </figure>
  )
}
