const Phaser = require('./Phaser')
const Brain = require('./Brain')

class Animal {
  constructor (x, y, parent) {
    this.health = game.math.between(100, 150)
    this.age = 0
    this.score = 0
    this.generation = parent ? parent.generation + 1 : 1

    this.sprite = game.add.sprite(game.TILE_SIZE * (x + 0.5), game.TILE_SIZE * (y + 0.5), game.cache.getBitmapData('animal' + this.health))
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE)
    this.sprite.body.collideWorldBounds = true
    this.sprite.anchor.setTo(0.5, 0.5)
    this.updateColor()

    this.sprite.angle = game.math.between(-180, 180)
    game.physics.arcade.velocityFromAngle(this.sprite.angle, game.math.between(10, 200), this.sprite.body.velocity)

    this.brain = parent ? new Brain(parent.brain) : new Brain(4, 10, 10, 3)
  }

  tick (tile) {
    this.health -= 2 + Math.sqrt(this.age * 0.01)
    this.age += 0.01

    let amountEating = 0

    if (tile.food >= 5) amountEating = 4
    else amountEating = tile.food

    if ((255 - this.health) < amountEating) amountEating = 255 - this.health

    if (amountEating) {
      this.health += amountEating
      this.score += amountEating
      tile.food -= amountEating
    }

    if (this.health < 0) this.health = 0

    const [speed, turn, wantToBreed] = this.brain.ask([tile.food, this.health, this.getFoodAhead(1), this.getFoodAhead(2)])

    if (this.health > 250 && wantToBreed > 0.5) {
      this.health -= 70
      game.animals.add(new Animal(this.getPosition().x, this.getPosition().y, this))
    }

    this.sprite.angle += (turn - 0.5) * 100
    game.physics.arcade.velocityFromAngle(this.sprite.angle, -speed * 200, this.sprite.body.velocity)
  }

  updateColor () {
    this.sprite.loadTexture(game.cache.getBitmapData('animal' + Math.floor(this.health)))
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

module.exports = Animal
