const Phaser = require('./Phaser')
const Tile = require('./Tile')
const Animal = require('./Animal')

const MAP_SIZE = 40
const TILE_SIZE = 40

global.game = new Phaser.Game(MAP_SIZE * TILE_SIZE, MAP_SIZE * TILE_SIZE,
  Phaser.AUTO, 'game-container', {create, render, update})

game.MAP_SIZE = MAP_SIZE
game.TILE_SIZE = TILE_SIZE
game.ANIMAL_NUMBER = 5
game.SPEED_MULTIPLIER = 1

const tiles = []
const animals = new Set()

function create () {
  game.physics.startSystem(Phaser.Physics.ARCADE)
  game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE
  game.stage.backgroundColor = '#555'

  game.tiles = tiles
  game.animals = animals

  for (let x = 0; x < game.MAP_SIZE; x++) {
    tiles[x] = []
    for (let y = 0; y < game.MAP_SIZE; y++) {
      tiles[x][y] = new Tile(x, y, game.TILE_SIZE, game)
    }
  }

  for (let i = 0; i < game.ANIMAL_NUMBER; i++) {
    spawnAnimal()
  }

  game.input.keyboard.addCallbacks(null, (event) => {
    let scale = 1 / game.scale.scaleFactor.x
    // '+' without shift is '='
    if (event.key === '+' || event.key === '=') {
      game.scale.setUserScale(scale + 0.05, scale + 0.05, 0, 0)
    } else if (event.key === '-') {
      game.scale.setUserScale(scale - 0.05, scale - 0.05, 0, 0)
    } else if (event.key === 'q') {
      game.SPEED_MULTIPLIER *= 2
    } else if (event.key === 'a') {
      game.SPEED_MULTIPLIER /= 2
    }
  })
}

function spawnAnimal () {
  const x = game.math.between(0, game.MAP_SIZE - 1)
  const y = game.math.between(0, game.MAP_SIZE - 1)
  animals.add(new Animal(x, y))
}

function render () {
  tiles.forEach(row => row.forEach(tile => tile.render()))
  animals.forEach(animal => animal.render())
}

// Call `game.updateLogic` manually when SPEED_MULTIPLIER > 1.
let manualUpdate = false

function update () {
  if (!manualUpdate) {
    manualUpdate = true
    for (let i = 1; i < game.SPEED_MULTIPLIER; i++) game.updateLogic(Date.now())
    manualUpdate = false
  }

  tiles.forEach(row => row.forEach(tile => tile.tick()))
  animals.forEach(animal => {
    animal.tick(tileAt(animal.getPosition()))
    if (animal.health <= 0) {
      animal.destroy()
      animals.delete(animal)
      if (animals.size < game.ANIMAL_NUMBER) spawnAnimal()
    }
  })
}

function tileAt (position) {
  return tiles[position.x][position.y]
}
