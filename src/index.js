const Phaser = require('./Phaser')
const Tile = require('./Tile')

const game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '', {create, update})

const MAP_SIZE = 50
let tiles = []

function create () {
  game.scale.scaleMode = Phaser.ScaleManager.RESIZE
  game.stage.backgroundColor = '#555'

  for (let x = 0; x < MAP_SIZE; x++) {
    tiles[x] = []
    for (let y = 0; y < MAP_SIZE; y++) {
      tiles[x][y] = new Tile(x, y, game)
    }
  }

  game.time.events.loop(1000, tick, this)
}

function update () {
  tiles.forEach(row => row.forEach(tile => tile.render()))
}

function tick () {
  tiles.forEach(row => row.forEach(tile => tile.tick()))
}
