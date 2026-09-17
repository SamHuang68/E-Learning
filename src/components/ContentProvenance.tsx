type Props = {
  children: string
}

/** High-risk STEM/CS footnotes only — not a site-wide citation system. */
export function ContentProvenance({ children }: Props) {
  return (
    <p className="content-provenance" role="note">
      {children}
    </p>
  )
}
