class Tile {
  constructor (x, y) {
    this.x = x
    this.y = y
    this.food = game.math.between(0, 50)
    this.sprite = game.add.sprite(game.TILE_SIZE * x, game.TILE_SIZE * y, getBlankBitmap(game.TILE_SIZE, game))
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
function getBlankBitmap () {
  if (!bitmap) {
    bitmap = game.make.bitmapData(game.TILE_SIZE, game.TILE_SIZE)
    bitmap.rect(0, 0, game.TILE_SIZE, game.TILE_SIZE, '#ffffff')
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
