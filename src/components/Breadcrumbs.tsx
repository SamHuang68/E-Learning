export type BreadcrumbItem = {
  label: string
  onClick?: () => void
  active?: boolean
}

type Props = {
  items: BreadcrumbItem[]
}

/**
 * 統一階層麵包屑導覽元件 (Unified Breadcrumbs Navigation)
 * 符合 WCAG 2.2 語意化導覽與鍵盤操作標準
 */
export function Breadcrumbs({ items }: Props) {
  if (!items || items.length === 0) return null

  return (
    <nav className="unified-breadcrumbs" aria-label="目前階層導覽">
      <ol className="breadcrumbs-list">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1 || item.active
          return (
            <li key={idx} className={`crumb-item ${isLast ? 'active' : ''}`}>
              {item.onClick && !isLast ? (
                <button
                  type="button"
                  className="crumb-link-btn"
                  onClick={item.onClick}
                >
                  {item.label}
                </button>
              ) : (
                <span
                  className="crumb-current"
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLast && (
                <span className="crumb-separator" aria-hidden="true">
                  /
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
