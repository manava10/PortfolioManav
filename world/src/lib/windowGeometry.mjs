export const LIMITS = { margin: 16, minWidth: 360, minHeight: 240 };
export function desktopBounds(viewport) {
  return { width: viewport.width, height: Math.max(1, viewport.height - 142) };
}
export function fitWindow(win, bounds) {
  const m = Math.min(LIMITS.margin, bounds.width / 10);
  const maxWidth = Math.max(1, bounds.width - m * 2);
  const maxHeight = Math.max(1, bounds.height - m * 2);
  const width = Math.min(maxWidth, Math.max(Math.min(LIMITS.minWidth, maxWidth), win.width));
  const height = Math.min(maxHeight, Math.max(Math.min(LIMITS.minHeight, maxHeight), win.height));
  return { ...win, width, height,
    x: Math.max(m, Math.min(bounds.width - width - m, win.x)),
    y: Math.max(m, Math.min(bounds.height - height - m, win.y)) };
}
export function maximizeWindow(win, bounds) {
  if (win.maximized) return fitWindow({ ...win, ...win.restore, maximized: false, restore: undefined }, bounds);
  const restore = { x: win.x, y: win.y, width: win.width, height: win.height };
  return { ...fitWindow({ ...win, x: LIMITS.margin, y: LIMITS.margin, width: bounds.width, height: bounds.height }, bounds), maximized: true, restore };
}
export function moveWindow(win, dx, dy, bounds) {
  return fitWindow({ ...win, x: win.x + dx, y: win.y + dy }, bounds);
}
export function resizeWindow(win, edge, dx, dy, bounds) {
  const m = LIMITS.margin;
  const minW = Math.min(LIMITS.minWidth, bounds.width - 2 * m);
  const minH = Math.min(LIMITS.minHeight, bounds.height - 2 * m);
  let { x, y, width, height } = win;
  if (edge.includes('e')) width = Math.max(minW, Math.min(bounds.width - x - m, width + dx));
  if (edge.includes('s')) height = Math.max(minH, Math.min(bounds.height - y - m, height + dy));
  if (edge.includes('w')) { const right = x + width; width = Math.max(minW, Math.min(right - m, width - dx)); x = right - width; }
  if (edge.includes('n')) { const bottom = y + height; height = Math.max(minH, Math.min(bottom - m, height - dy)); y = bottom - height; }
  return fitWindow({ ...win, x, y, width, height }, bounds);
}
