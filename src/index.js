const Phaser = require('./Phaser')
const Tile = require('./Tile')
const Animal = require('./Animal')
const generateTextures = require('./generateTextures')

const MAP_SIZE = 50
const TILE_SIZE = 30
const FOOD_ABUNDANCE = 5
const DEFAULT_ZOOM = 0.5

global.game = new Phaser.Game({
  state: {create, update, render},
  container: 'game-container',
  renderer: Phaser.AUTO,
  width: MAP_SIZE * TILE_SIZE,
  height: MAP_SIZE * TILE_SIZE
})

game.MAP_SIZE = MAP_SIZE
game.TILE_SIZE = TILE_SIZE
game.ANIMAL_NUMBER = 5
game.SPEED_MULTIPLIER = 1

const tiles = []
const animals = new Set()

function create () {
  game.physics.startSystem(Phaser.Physics.ARCADE)
  game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE
  game.scale.setUserScale(DEFAULT_ZOOM, DEFAULT_ZOOM, 0, 0)
  game.stage.backgroundColor = '#555'

  // Disable pause on blur.
  game.stage.disableVisibilityChange = true

  game.yearsRunning = 0

  generateTextures(TILE_SIZE)

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
let maxPopulation = 0

let maxScoreAlive = 0
let maxAgeAlive = 0
let maxGenerationAlive = 0

function update () {
  if (!manualUpdate) {
    manualUpdate = true
    for (let i = 1; i < game.SPEED_MULTIPLIER; i++) game.updateLogic(Date.now())
    manualUpdate = false
  }

  game.yearsRunning += 0.01

  maxScoreAlive = 0
  maxAgeAlive = 0
  maxGenerationAlive = 0

  if (maxPopulation < animals.size) maxPopulation = animals.size

  for (let i = 0; i < FOOD_ABUNDANCE; i++) {
    const x = game.math.between(0, game.MAP_SIZE - 1)
    const y = game.math.between(0, game.MAP_SIZE - 1)
    const tile = tileAt({x, y})
    tile.food += 20
    if (tile.food > 255) tile.food = 255
    tile.updateColor()
  }

  let animalGroup = Array.from(animals).map(a => {
    a.overlapWithAnother = 0
    return a.sprite
  })

  game.physics.arcade.overlap(animalGroup, animalGroup, (a, b) => {
    const dis = game.physics.arcade.distanceBetween(a, b)
    b.animal.overlapWithAnother = a.animal.overlapWithAnother = TILE_SIZE - Math.min(dis, TILE_SIZE)
  })

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
}

function render () {
  animals.forEach(a => a.updateColor())

  window['years-running'].innerText = Math.floor(game.yearsRunning)
  window['game-speed'].innerText = game.SPEED_MULTIPLIER
  window['population-now'].innerText = animals.size
  window['population-max'].innerText = maxPopulation
  window['max-score-now'].innerText = Math.floor(maxScoreAlive)
  window['max-score-max'].innerText = Math.floor(maxScoreOverall)
  window['max-age-now'].innerText = Math.floor(maxAgeAlive)
  window['max-age-max'].innerText = Math.floor(maxAgeOverall)
  window['max-generation-now'].innerText = Math.floor(maxGenerationAlive)
  window['max-generation-max'].innerText = Math.floor(maxGenerationOverall)
}

function tileAt (position) {
  return (tiles[position.x] || [])[position.y] || {food: 0}
}
