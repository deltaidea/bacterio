const Phaser = require('./Phaser')
const Tile = require('./Tile')
const Animal = require('./Animal')

const MAP_SIZE = 60
const TILE_SIZE = 30
const FOOD_ABUNDANCE = 10

global.game = new Phaser.Game(MAP_SIZE * TILE_SIZE, MAP_SIZE * TILE_SIZE,
  Phaser.AUTO, 'game-container', {create, update})

game.MAP_SIZE = MAP_SIZE
game.TILE_SIZE = TILE_SIZE
game.ANIMAL_NUMBER = 5
game.SPEED_MULTIPLIER = 1

const tiles = []
const animals = new Set()

function create () {
  game.physics.startSystem(Phaser.Physics.ARCADE)
  game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE
  game.scale.setUserScale(0.3, 0.3, 0, 0)
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
    // Scale up. '+' without shift is '='
    if (event.key === '+' || event.key === '=') {
      let scale = game.math.clamp(1 / game.scale.scaleFactor.x + 0.05, 0.1, 1)
      game.scale.setUserScale(scale, scale, 0, 0)
    // Scale down.
    } else if (event.key === '-') {
      let scale = game.math.clamp(1 / game.scale.scaleFactor.x - 0.05, 0.1, 1)
      game.scale.setUserScale(scale, scale, 0, 0)
    // Speed up.
    } else if (event.key === 'q') {
      game.SPEED_MULTIPLIER = game.math.clamp(game.SPEED_MULTIPLIER * 2, 1, 128)
    // Speed down.
    } else if (event.key === 'a') {
      game.SPEED_MULTIPLIER = game.math.clamp(game.SPEED_MULTIPLIER / 2, 1, 128)
    }
  })
}

function spawnAnimal () {
  const x = game.math.between(0, game.MAP_SIZE - 1)
  const y = game.math.between(0, game.MAP_SIZE - 1)
  animals.add(new Animal(x, y))
}

// Call `game.updateLogic` manually when SPEED_MULTIPLIER > 1.
let manualUpdate = false

let maxScoreOverall = 0
let maxAgeOverall = 0
let maxGenerationOverall = 0

function update () {
  if (!manualUpdate) {
    manualUpdate = true
    for (let i = 1; i < game.SPEED_MULTIPLIER; i++) game.updateLogic(Date.now())
    manualUpdate = false
  }

  let maxScoreAlive = 0
  let maxAgeAlive = 0
  let maxGenerationAlive = 0

  for (let i = 0; i < FOOD_ABUNDANCE; i++) {
    const x = game.math.between(0, game.MAP_SIZE - 1)
    const y = game.math.between(0, game.MAP_SIZE - 1)
    const tile = tileAt({x, y})
    tile.food += 20
    if (tile.food > 255) tile.food = 255
    tile.updateColor()
  }

  animals.forEach(animal => {
    animal.tick(tileAt(animal.getPosition()))
    if (maxScoreAlive < animal.score) maxScoreAlive = animal.score
    if (maxScoreOverall < animal.score) maxScoreOverall = animal.score
    if (maxAgeAlive < animal.age) maxAgeAlive = animal.age
    if (maxAgeOverall < animal.age) maxAgeOverall = animal.age
    if (maxGenerationAlive < animal.generation) maxGenerationAlive = animal.generation
    if (maxGenerationOverall < animal.generation) maxGenerationOverall = animal.generation
    if (animal.health <= 0) {
      animal.destroy()
      animals.delete(animal)
      if (animals.size < game.ANIMAL_NUMBER) spawnAnimal()
    }
  })

  document.querySelector('#population').innerText = animals.size
  document.querySelector('#max-score-alive').innerText = Math.floor(maxScoreAlive)
  document.querySelector('#max-score-overall').innerText = Math.floor(maxScoreOverall)
  document.querySelector('#max-age-alive').innerText = Math.floor(maxAgeAlive)
  document.querySelector('#max-age-overall').innerText = Math.floor(maxAgeOverall)
  document.querySelector('#max-generation-alive').innerText = Math.floor(maxGenerationAlive)
  document.querySelector('#max-generation-overall').innerText = Math.floor(maxGenerationOverall)
}

function tileAt (position) {
  return tiles[position.x][position.y]
}
