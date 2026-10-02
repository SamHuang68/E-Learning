import React, { useId, useMemo } from 'react'
import type { TrackRadar } from '../engine/radar'
import { useI18n } from '../i18n/i18n'
import { localizeTrackRadar } from '../i18n/radarI18n'
import { buildRadarLayout, RADAR_GRID_LEVELS } from './knowledgeRadarLayout'

type Props = {
  radar: TrackRadar
  size?: number
}

/**
 * 多維度練習紀錄雷達圖元件 (KnowledgeRadar)
 * 輕量級純 SVG 繪製五邊形蜘蛛網雷達圖，零第三方圖表庫依賴。
 */
export const KnowledgeRadar = React.memo(function KnowledgeRadar({ radar, size = 320 }: Props) {
  const radarId = useId()
  const { locale, t } = useI18n()
  const localized = useMemo(() => localizeTrackRadar(radar, locale), [radar, locale])
  const layout = useMemo(() => buildRadarLayout(localized, size), [localized, size])
  const { cx, cy, grid, axes, dataPoints, polygonPoints, labels, dimensions } = layout

  return (
    <div className="knowledge-radar-card">
      <div className="radar-header">
        <h3>📊 {t('ui.radarTitle', { track: localized.trackName })}</h3>
        <span className="radar-avg-badge">{t('ui.radarAvg', { score: localized.averageScore })}</span>
      </div>

      <div className="radar-svg-container">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="radar-svg"
          role="img"
          aria-labelledby={`knowledge-radar-title-${radarId} knowledge-radar-desc-${radarId}`}
        >
          <title id={`knowledge-radar-title-${radarId}`}>{t('ui.radarAriaTitle', { track: localized.trackName })}</title>
          <desc id={`knowledge-radar-desc-${radarId}`}>
            {t('ui.radarAriaDesc', {
              score: localized.averageScore,
              details: dimensions.map((dimension) => `${dimension.label} ${dimension.score}`).join('; '),
            })}
          </desc>
          {grid.map((points, idx) => {
            const lvl = RADAR_GRID_LEVELS[idx]
            return (
              <polygon
                key={`grid-${lvl}`}
                points={points}
                fill="none"
                stroke="#e2e8f0"
                strokeWidth={lvl === 1 ? '1.5' : '1'}
                strokeDasharray={lvl < 1 ? '3,3' : undefined}
              />
            )
          })}

          {axes.map((p, i) => (
            <line
              key={`axis-${i}`}
              x1={cx}
              y1={cy}
              x2={p.x}
              y2={p.y}
              stroke="#cbd5e1"
              strokeWidth="1"
            />
          ))}

          <polygon
            points={polygonPoints}
            fill="rgba(59, 130, 246, 0.25)"
            stroke="#2563eb"
            strokeWidth="2.5"
          />

          {dataPoints.map((p, i) => (
            <circle
              key={`dot-${i}`}
              cx={p.x}
              cy={p.y}
              r="4.5"
              fill="#2563eb"
              stroke="#ffffff"
              strokeWidth="2"
            />
          ))}

          {labels.map((label) => (
            <text
              key={`label-${label.key}`}
              x={label.x}
              y={label.y}
              textAnchor={label.textAnchor}
              fontSize="11"
              fontWeight="700"
              fill="#334155"
            >
              {label.label} ({label.score})
            </text>
          ))}
        </svg>
      </div>

      <ul className="sr-only">
        {dimensions.map((dimension) => (
          <li key={dimension.key}>{t('ui.radarRow', { label: dimension.label, score: dimension.score, total: dimension.fullMark })}</li>
        ))}
      </ul>

      <div className="radar-insights-row">
        <div className="insight-badge strong">
          <span>🌟 {t('ui.radarStrong')}</span>
          <strong>{t('ui.radarPoints', { label: localized.strongestDimension.label, score: localized.strongestDimension.score })}</strong>
        </div>
        <div className="insight-badge weak">
          <span>🎯 {t('ui.radarExplore')}</span>
          <strong>{t('ui.radarPoints', { label: localized.weakestDimension.label, score: localized.weakestDimension.score })}</strong>
        </div>
      </div>
    </div>
  )
})
