module.exports = function createRect (x, y, width, height, color) {
  const bitmap = game.make.bitmapData(width, height)
  bitmap.rect(0, 0, width, height, color)
  return game.add.sprite(x, y, bitmap)
}
