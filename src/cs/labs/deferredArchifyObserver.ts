export function attachArchifyIframeObserver(
  node: Element,
  onEnter: () => void,
  rootMargin = '200px 0px',
): () => void {
  if (typeof IntersectionObserver === 'undefined') {
    onEnter()
    return () => {}
  }
  const io = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) onEnter()
    },
    { rootMargin, threshold: 0.01 },
  )
  io.observe(node)
  return () => io.disconnect()
}
