const Phaser = require('./Phaser')
const createRect = require('./createRect')
const Tile = require('./Tile')
const Animal = require('./Animal')

global.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '', {create, update})

game.MAP_SIZE = 50
game.TILE_SIZE = 8
game.ANIMAL_NUMBER = 10

const tiles = []
const animals = new Set()
let borders

function create () {
  game.physics.startSystem(Phaser.Physics.ARCADE)
  game.scale.scaleMode = Phaser.ScaleManager.RESIZE
  game.stage.backgroundColor = '#555'
  borders = createBorders()

  for (let x = 0; x < game.MAP_SIZE; x++) {
    tiles[x] = []
    for (let y = 0; y < game.MAP_SIZE; y++) {
      tiles[x][y] = new Tile(x, y, game.TILE_SIZE, game)
    }
  }

  for (let i = 0; i < game.ANIMAL_NUMBER; i++) {
    const x = game.math.between(0, game.MAP_SIZE - 1)
    const y = game.math.between(0, game.MAP_SIZE - 1)
    animals.add(new Animal(x, y, game.TILE_SIZE, game))
  }

  game.time.events.loop(33, tick)
}

function update () {
  tiles.forEach(row => row.forEach(tile => tile.render()))
  animals.forEach(animal => {
    animal.render()
    game.physics.arcade.collide(animal.sprite, borders)
  })
}

function tick () {
  tiles.forEach(row => row.forEach(tile => tile.tick()))
  animals.forEach(animal => {
    animal.tick(tileAt(animal.getPosition()))
    if (animal.health <= 0) {
      animal.destroy()
      animals.delete(animal)
    }
  })
}

function tileAt (position) {
  return tiles[position.x][position.y]
}

function createBorders () {
  const size = game.MAP_SIZE * game.TILE_SIZE
  const borders = game.add.physicsGroup()

  const rightBorder = createRect(size, 0, 10, size, 'rgba(0,0,0,0)')
  game.physics.enable(rightBorder, Phaser.Physics.ARCADE)
  rightBorder.body.immovable = true
  borders.add(rightBorder)

  const bottomBorder = createRect(0, size, size, 10, 'rgba(0,0,0,0)')
  game.physics.enable(bottomBorder, Phaser.Physics.ARCADE)
  bottomBorder.body.immovable = true
  borders.add(bottomBorder)

  return borders
}
