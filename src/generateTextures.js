module.exports = function generateBitmaps (size) {
  for (let food = 0; food <= 255; food++) {
    let bitmap = game.make.bitmapData(size, size)
    // More food - less brightness.
    let brightness = 255 - food
    bitmap.rect(0, 0, size, size,
      rgbToCss(brightness * 1.2, brightness * 1.3, brightness))
    game.cache.addBitmapData('tile' + food, bitmap)
  }

  for (let health = 0; health <= 255; health++) {
    let bitmap = game.make.bitmapData(size, size)
    // Body.
    bitmap.circle(size / 2, size / 2, size / 2,
      rgbToCss(255 - health, health * 1.2, health * 0.6))
    // Head.
    bitmap.circle(size / 4, size / 2, size / 4,
      rgbToCss((255 - health) * 0.5, health * 0.6, health * 0.3))
    game.cache.addBitmapData('animal' + health, bitmap)
  }
}

function rgbToCss (r, g, b) {
  r = game.math.clamp(Math.round(r), 0, 255)
  g = game.math.clamp(Math.round(g), 0, 255)
  b = game.math.clamp(Math.round(b), 0, 255)
  // Adding as 2-digit hex numbers (0-255 dec) to get css color value.
  return '#' + ((r * 0x10000) + (g * 0x100) + b).toString(16)
}
