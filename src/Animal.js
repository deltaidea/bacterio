const Phaser = require('./Phaser')
const Brain = require('./Brain')

class Animal {
  constructor (x, y, parent) {
    this.health = game.math.between(50, 100)
    this.age = 0
    this.score = 0
    this.generation = parent ? parent.generation + 1 : 1

    this.sprite = game.add.sprite(game.TILE_SIZE * (x + 0.5), game.TILE_SIZE * (y + 0.5), game.cache.getBitmapData('animal' + this.health))
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE)
    this.sprite.body.setCircle(game.TILE_SIZE / 4, game.TILE_SIZE / 4, game.TILE_SIZE / 4)
    this.sprite.body.collideWorldBounds = true
    this.sprite.anchor.setTo(0.5, 0.5)

    // Back-reference for collision handling based on sprites.
    this.sprite.animal = this

    this.sprite.angle = game.math.between(-180, 180)
    game.physics.arcade.velocityFromAngle(this.sprite.angle, game.math.between(10, 200), this.sprite.body.velocity)

    this.brain = parent ? new Brain(parent.brain) : new Brain(7, 10, 10, 3)
  }

  tick (tile) {
    this.health -= 0.3 + Math.sqrt(this.age * 0.001)
    this.age += 0.01

    let amountEating = Math.min(Math.min(tile.food, 0.6), 255 - this.health)

    tile.food -= amountEating
    this.health += amountEating
    this.score += amountEating

    if (this.health < 0) this.health = 0

    const [speed, turn, wantToBreed] = this.brain.ask([
      tile.food,
      this.age,
      this.health,
      this.getFoodAhead(-30, 3),
      this.getFoodAhead(0, 1),
      this.getFoodAhead(30, 3),
      this.overlapWithAnother
    ])

    if (this.health > 230 && wantToBreed > 0.5) {
      this.health -= 150
      const {x, y} = this.getPosition()
      game.animals.add(new Animal(x, y, this))
    }

    this.sprite.angle += (turn - 0.5) * 100
    game.physics.arcade.velocityFromAngle(this.sprite.angle, speed * 100, this.sprite.body.velocity)
  }

  updateColor () {
    this.sprite.loadTexture(game.cache.getBitmapData('animal' + Math.floor(this.health)))
  }

  destroy () {
    this.sprite.destroy()
  }

  getPosition (point) {
    point = point || {x: this.sprite.centerX, y: this.sprite.centerY}
    return {
      x: Math.floor(point.x / game.TILE_SIZE),
      y: Math.floor(point.y / game.TILE_SIZE)
    }
  }

  getFoodAhead (angle, tiles) {
    const line = new Phaser.Line().fromAngle(this.sprite.centerX, this.sprite.centerY,
      game.math.degToRad(this.sprite.angle + angle), game.TILE_SIZE * tiles)

    const positionAhead = this.getPosition(line.end)
    const tileAhead = (game.tiles[positionAhead.x] || [])[positionAhead.y] || {}

    return tileAhead.food == null ? -1 : tileAhead.food
  }
}

module.exports = Animal
