const Pixi = require('pixi.js')

const TILE_SIZE = 8

class Tile {
  constructor (x, y) {
    this.x = x
    this.y = y
    this.food = getRandomInt(0, 255)
    this.rectangle = new Pixi.Graphics()
  }

  render () {
    this.rectangle.beginFill(foodToRgb(this.food))
    this.rectangle.drawRect(this.x * TILE_SIZE, this.y * TILE_SIZE, TILE_SIZE, TILE_SIZE)
    this.rectangle.endFill()
  }
}

// http://stackoverflow.com/a/1527820/6360623
function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function foodToRgb (food) {
  // 2-digit hex number (0-255 dec) three times: 56 -> 565656.
  return (food * 0x10000) + (food * 0x100) + food
}

module.exports = Tile
