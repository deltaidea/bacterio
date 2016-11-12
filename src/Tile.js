class Tile {
  constructor (x, y, tileSize, game) {
    this.x = x
    this.y = y
    this.food = game.math.between(0, 50)
    this.sprite = game.add.sprite(tileSize * x, tileSize * y, getBlankBitmap(tileSize, game))
  }

  tick () {
    this.food += 1
    if (this.food > 255) this.food = 255
  }

  render () {
    this.sprite.tint = foodToRgb(this.food)
  }
}

let bitmap = null
function getBlankBitmap (tileSize, game) {
  if (!bitmap) {
    bitmap = game.make.bitmapData(tileSize, tileSize)
    bitmap.rect(0, 0, tileSize, tileSize, '#ffffff')
  }
  return bitmap
}

function foodToRgb (food) {
  // More food - less brightness.
  let brightness = 255 - food
  // 2-digit hex number (0-255 dec) three times: 56 -> 565656.
  return (brightness * 0x10000) + (brightness * 0x100) + brightness
}

module.exports = Tile
