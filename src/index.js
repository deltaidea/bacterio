const Phaser = require('./Phaser')
const Tile = require('./Tile')
const Animal = require('./Animal')

const game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '', {create, update})

const MAP_SIZE = 50
const TILE_SIZE = 8
const ANIMAL_NUMBER = 10
let tiles = []
let animals = new Set()

function create () {
  game.scale.scaleMode = Phaser.ScaleManager.RESIZE
  game.stage.backgroundColor = '#555'

  for (let x = 0; x < MAP_SIZE; x++) {
    tiles[x] = []
    for (let y = 0; y < MAP_SIZE; y++) {
      tiles[x][y] = new Tile(x, y, TILE_SIZE, game)
    }
  }

  for (let i = 0; i < ANIMAL_NUMBER; i++) {
    const x = game.math.between(0, MAP_SIZE - 1)
    const y = game.math.between(0, MAP_SIZE - 1)
    animals.add(new Animal(x, y, TILE_SIZE, game))
  }

  game.time.events.loop(33, tick)
}

function update () {
  tiles.forEach(row => row.forEach(tile => tile.render()))
  animals.forEach(a => a.render())
}

function tick () {
  tiles.forEach(row => row.forEach(tile => tile.tick()))
  animals.forEach(animal => {
    animal.tick()
    if (animal.health <= 0) {
      animal.destroy()
      animals.delete(animal)
    }
  })
}
