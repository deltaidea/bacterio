const Pixi = require('pixi.js')

const TILE_SIZE = 8

class Animal {
  constructor (x, y) {
    this.x = x
    this.y = y
    this.rendered = new Pixi.Graphics()
  }

  render () {
    this.rendered.clear()
    this.rendered.beginFill(0xdd0000)
    this.rendered.drawCircle(this.x * TILE_SIZE + TILE_SIZE / 2, this.y * TILE_SIZE + TILE_SIZE / 2, TILE_SIZE / 2)
    this.rendered.endFill()
  }

  move () {
    this.x += 0.01
    this.y += 0.01
  }
}

module.exports = Animal
