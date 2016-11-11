const Pixi = require('pixi.js')
const getRandomInt = require('./getRandomInt')

const TILE_SIZE = 8

class Tile {
  constructor (x, y) {
    this.x = x
    this.y = y
    this.food = getRandomInt(0, 50)
    this.rectangle = new Pixi.Graphics()
  }

  render () {
    this.rectangle.beginFill(foodToRgb(this.food))
    this.rectangle.drawRect(this.x * TILE_SIZE, this.y * TILE_SIZE, TILE_SIZE, TILE_SIZE)
    this.rectangle.endFill()
  }
}

function foodToRgb (food) {
  // More food - less brightness.
  let brightness = 255 - food
  // 2-digit hex number (0-255 dec) three times: 56 -> 565656.
  return (brightness * 0x10000) + (brightness * 0x100) + brightness
}

module.exports = Tile
