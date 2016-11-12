const Phaser = require('./Phaser')
const Brain = require('./Brain')

class Animal {
  constructor (x, y) {
    this.x = x
    this.y = y
    this.health = game.math.between(200, 255)
    this.sprite = game.add.sprite(game.TILE_SIZE * x, game.TILE_SIZE * y, getBlankBitmap(game.TILE_SIZE, game))
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE)

    this.brain = new Brain(2, 5, 5, 2)
  }

  tick (tile) {
    this.health -= 2

    let amountEating = 0

    if (tile.food >= 5) amountEating = 5
    else amountEating = tile.food

    if ((255 - this.health) < amountEating) amountEating = 255 - this.health

    this.health += amountEating
    tile.food -= amountEating

    if (this.health < 0) this.health = 0

    let proposedSpeed = this.brain.ask([tile.food, this.health])
    this.sprite.body.velocity.set(proposedSpeed[0] * 500 - 250, proposedSpeed[1] * 500 - 250)
  }

  render () {
    this.sprite.tint = healthToRgb(this.health)
  }

  destroy () {
    this.sprite.destroy()
  }

  getPosition () {
    return {
      x: Math.floor(this.sprite.centerX / game.TILE_SIZE),
      y: Math.floor(this.sprite.centerY / game.TILE_SIZE)
    }
  }
}

let bitmap = null
function getBlankBitmap () {
  if (!bitmap) {
    bitmap = game.make.bitmapData(game.TILE_SIZE, game.TILE_SIZE)
    bitmap.circle(game.TILE_SIZE / 2, game.TILE_SIZE / 2, game.TILE_SIZE / 2, '#ff0000')
  }
  return bitmap
}

function healthToRgb (health) {
  // More health - less brightness.
  let brightness = 255 - health
  // 2-digit hex number (0-255 dec) three times: 56 -> 565656.
  return (brightness * 0x10000) + (brightness * 0x100) + brightness
}

module.exports = Animal
