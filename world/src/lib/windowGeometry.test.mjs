import test from 'node:test';
import assert from 'node:assert/strict';
import { desktopBounds, fitWindow, moveWindow, resizeWindow, maximizeWindow } from './windowGeometry.mjs';
const bounds = { width: 800, height: 600 };
const win = { id: 'projects', x: 220, y: 40, width: 650, height: 500 };
function assertInside(w, b) { assert.ok(w.x >= 0 && w.y >= 0); assert.ok(w.x + w.width <= b.width); assert.ok(w.y + w.height <= b.height); }
test('a window opens fully inside a smaller desktop', () => assertInside(fitWindow(win, bounds), bounds));
test('drag cannot strand controls offscreen', () => { for (const d of [-10000, 10000]) assertInside(moveWindow(win, d, d, bounds), bounds); });
test('all resize edges retain minimum size and stay inside desktop', () => {
  const fitted = fitWindow(win, bounds);
  for (const edge of ['n','s','e','w','ne','nw','se','sw']) for (const d of [-10000,10000]) {
    const next = resizeWindow(fitted,edge,d,d,bounds); assertInside(next,bounds); assert.ok(next.width >= 360); assert.ok(next.height >= 240);
    if (edge.includes('w')) assert.equal(next.x + next.width, fitted.x + fitted.width);
    if (edge.includes('n')) assert.equal(next.y + next.height, fitted.y + fitted.height);
  }
});
test('maximize and restore preserve a resized window', () => {
  const original=fitWindow({...win,width:470,height:350},bounds), max=maximizeWindow(original,bounds), restored=maximizeWindow(max,bounds);
  assertInside(max,bounds); assert.equal(max.width,768); assert.equal(restored.width,470); assert.equal(restored.height,350); assert.equal(restored.x,original.x); assert.equal(restored.y,original.y);
});
test('browser shrink refits existing windows without overflow', () => {
  const small={width:320,height:350}; assertInside(fitWindow(win,small),small);
  assertInside(maximizeWindow(maximizeWindow(fitWindow(win,bounds),bounds),small),small);
});
test('short landscape screens leave room for the menu and dock', () => {
  const short = desktopBounds({width: 700, height: 320});
  assert.equal(short.height, 178);
  assertInside(fitWindow(win, short), short);
  assertInside(maximizeWindow(fitWindow(win, short), short), short);
});
