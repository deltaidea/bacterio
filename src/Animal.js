const Phaser = require('./Phaser')
const Brain = require('./Brain')

class Animal {
  constructor (x, y, parent) {
    this.health = game.math.between(100, 150)

    let bitmap = game.make.bitmapData(game.TILE_SIZE, game.TILE_SIZE)
    bitmap.circle(game.TILE_SIZE / 2, game.TILE_SIZE / 2, game.TILE_SIZE / 4, '#ff0000')
    bitmap.circle(game.TILE_SIZE / 4, game.TILE_SIZE / 2, game.TILE_SIZE / 8, '#0000ff')
    this.sprite = game.add.sprite(game.TILE_SIZE * (x + 0.5), game.TILE_SIZE * (y + 0.5), bitmap)
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE)
    this.sprite.anchor.setTo(0.5, 0.5)

    this.sprite.angle = game.math.between(-180, 180)
    game.physics.arcade.velocityFromAngle(this.sprite.angle, game.math.between(10, 200), this.sprite.body.velocity)

    this.brain = parent ? new Brain(parent.brain) : new Brain(3, 10, 10, 2)
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

    if (this.health > 250) {
      this.health -= 40
      game.animals.add(new Animal(this.getPosition().x, this.getPosition().y, this))
    }

    let [v, a] = this.brain.ask([tile.food, this.health, this.getFoodAhead(1), this.getFoodAhead(2)])
    this.sprite.angle += (a - 0.5) * 100
    game.physics.arcade.velocityFromAngle(this.sprite.angle, -v * 200, this.sprite.body.velocity)
  }

  render () {
    this.sprite.tint = healthToRgb(this.health)
  }

  destroy () {
    this.sprite.destroy()
  }

  getPosition (point = this.sprite) {
    return {
      x: Math.floor(point.centerX / game.TILE_SIZE),
      y: Math.floor(point.centerY / game.TILE_SIZE)
    }
  }

  getFoodAhead (tilesAhead) {
    const velocityXSign = this.sprite.body.velocity.x >= 0 ? 1 : -1
    const velocityYSign = this.sprite.body.velocity.y >= 0 ? 1 : -1
    const velocityXAbs = Math.abs(this.sprite.body.velocity.x)
    const velocityYAbs = Math.abs(this.sprite.body.velocity.y)

    const s = game.TILE_SIZE

    const pointAhead = {
      centerX: this.sprite.centerX + velocityXSign * game.math.clamp(velocityXAbs, (s - 0.5) * tilesAhead, s * tilesAhead),
      centerY: this.sprite.centerY + velocityYSign * game.math.clamp(velocityYAbs, (s - 0.5) * tilesAhead, s * tilesAhead)
    }
    const positionAhead = this.getPosition(pointAhead)
    const tileAhead = (game.tiles[positionAhead.x] || [])[positionAhead.y] || {}

    return tileAhead.food == null ? -1 : tileAhead.food
  }
}

function healthToRgb (health) {
  // More health - less brightness.
  let brightness = 128 + Math.round(health / 2)
  // 2-digit hex number (0-255 dec) three times: 56 -> 565656.
  return (brightness * 0x10000) + (brightness * 0x100) + brightness
}

module.exports = Animal
