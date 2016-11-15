// TODO: Memory leak comes from PIXI.CanvasPool.pool (array),
// which is being filled up by every permutation of bitmaps when they're tinted.
// Maybe it's cheaper to compute all 256 tints at `create` time and  reuse them.
// See also: html5gamedevs.com/topic/26018-solved-using-tinted-bitmaptext-causes-memory-leaks-in-canvas
// Workaround:
setInterval(() => {
  global.PIXI.CanvasPool.pool.forEach(e => { delete e.parentNode })
  global.PIXI.CanvasPool.pool = []
}, 1000)

module.exports = function createRect (x, y, width, height, color) {
  const bitmap = game.make.bitmapData(width, height)
  bitmap.rect(0, 0, width, height, color)
  return game.add.sprite(x, y, bitmap)
}
