const Phaser = require('./Phaser')
const createRect = require('./createRect')
const Tile = require('./Tile')
const Animal = require('./Animal')

global.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '', {create, update})

game.MAP_SIZE = 80
game.TILE_SIZE = 12
game.ANIMAL_NUMBER = 20

const tiles = []
const animals = new Set()
let borders
let cursorKeys
let worldScale = 1
let player

function create () {
  cursorKeys = game.input.keyboard.createCursorKeys()
  game.physics.startSystem(Phaser.Physics.ARCADE)
  const size = game.MAP_SIZE * game.TILE_SIZE
  game.scale.scaleMode = Phaser.ScaleManager.RESIZE
  game.world.setBounds(-size, -size, size * 3, size * 3)
  game.stage.backgroundColor = '#555'

  game.tiles = tiles
  game.animals = animals
  borders = createBorders()

  // Add an invisible player as a pivot for zoom.
  player = createRect(size / 2, size / 2, 1, 1, 'rgba(0,0,0,0)')
  game.camera.follow(player)

  for (let x = 0; x < game.MAP_SIZE; x++) {
    tiles[x] = []
    for (let y = 0; y < game.MAP_SIZE; y++) {
      tiles[x][y] = new Tile(x, y, game.TILE_SIZE, game)
    }
  }

  for (let i = 0; i < game.ANIMAL_NUMBER; i++) {
    spawnAnimal()
  }

  game.time.events.loop(16, tick)
}

function spawnAnimal () {
  const x = game.math.between(1, game.MAP_SIZE - 2)
  const y = game.math.between(1, game.MAP_SIZE - 2)
  animals.add(new Animal(x, y))
}

function update () {
  updateCamera()

  tiles.forEach(row => row.forEach(tile => tile.render()))
  animals.forEach(animal => {
    animal.render()
    game.physics.arcade.collide(animal.sprite, borders)
  })
}

function updateCamera () {
  if (cursorKeys.up.isDown) {
    player.y -= 25
  } else if (cursorKeys.down.isDown) {
    player.y += 25
  }

  if (cursorKeys.left.isDown) {
    player.x -= 25
  } else if (cursorKeys.right.isDown) {
    player.x += 25
  }

  if (game.input.keyboard.isDown(Phaser.Keyboard.Q)) worldScale += 0.1
  else if (game.input.keyboard.isDown(Phaser.Keyboard.A)) worldScale -= 0.1
  worldScale = game.math.clamp(worldScale, 0.5, 2)
  game.world.scale.set(worldScale)
}

function tick () {
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

function createBorders () {
  const size = game.MAP_SIZE * game.TILE_SIZE
  const bordersGroup = game.add.physicsGroup()

  const borders = [
    [0, -10, size, 10], // top
    [size, 0, 10, size], // right
    [0, size, size, 10], // bottom
    [-10, 0, 10, size] // left
  ]

  borders.forEach(dimensions => {
    const border = createRect(...dimensions, 'rgba(0,0,0,0)')
    game.physics.enable(border, Phaser.Physics.ARCADE)
    border.body.immovable = true
    bordersGroup.add(border)
  })

  return bordersGroup
}
