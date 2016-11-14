const Phaser = require('./Phaser')
const Tile = require('./Tile')
const Animal = require('./Animal')

const MAP_SIZE = 40
const TILE_SIZE = 40
const ANIMAL_NUMBER = 5

const GAME_SIZE = MAP_SIZE * TILE_SIZE

global.game = new Phaser.Game(GAME_SIZE, GAME_SIZE, Phaser.AUTO, 'game-container', {create, render, update})

game.MAP_SIZE = MAP_SIZE
game.TILE_SIZE = TILE_SIZE
game.ANIMAL_NUMBER = ANIMAL_NUMBER

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
    let scaleFactor = 1 / game.scale.scaleFactor.x
    // '+' without shift is '='
    if (event.key === '+' || event.key === '=') scaleFactor += 0.05
    else if (event.key === '-') scaleFactor -= 0.05
    game.scale.setUserScale(scaleFactor, scaleFactor, 0, 0)
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

function update () {
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
