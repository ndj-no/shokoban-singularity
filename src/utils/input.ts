// Utility helpers for translating touch swipe deltas into movement directions.
// A direction is returned as a tuple [dx, dy] consistent with existing move(dx, dy) usage.
// If the movement does not exceed the threshold or can't be resolved, returns null.
export function swipeVectorToDir(dx: number, dy: number, threshold = 30): [number, number] | null {
  const adx = Math.abs(dx)
  const ady = Math.abs(dy)
  if (adx < threshold && ady < threshold) return null // below intent threshold
  if (adx > ady) return dx > 0 ? [1, 0] : [-1, 0]
  return dy > 0 ? [0, 1] : [0, -1]
}

