const createRect = require('./createRect')

class Tile {
  constructor (x, y) {
    this.x = x
    this.y = y
    this.food = game.math.between(0, 50)
    this.sprite = createRect(game.TILE_SIZE * x, game.TILE_SIZE * y, game.TILE_SIZE, game.TILE_SIZE, '#ffffff')
  }

  tick () {
    if (game.math.between(0, 500) === 0) this.food += 20
    if (this.food > 255) this.food = 255
  }

  render () {
    this.sprite.tint = foodToRgb(this.food)
  }
}

function foodToRgb (food) {
  // More food - less brightness.
  let brightness = 255 - food
  let r = game.math.clamp(Math.round(brightness * 1.2), 0, 255)
  let g = game.math.clamp(Math.round(brightness * 1.3), 0, 255)
  let b = game.math.clamp(Math.round(brightness), 0, 255)
  // Adding as 2-digit hex numbers (0-255 dec) to get css color value.
  return (r * 0x10000) + (g * 0x100) + b
}

module.exports = Tile
