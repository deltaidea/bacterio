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
  // food is 8-bit number. Copy it 3 times by moving to the left and inserting another copy.
  return (((food << 8) | food) << 8) | food
}

module.exports = Tile
