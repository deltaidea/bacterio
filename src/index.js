const Phaser = require('./Phaser')

const TILE_SIZE = 32
const TILE_COLORS = {
  RED: 0,
  GREEN: 1
}

const game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '', {create, update})

function create () {
  game.scale.scaleMode = Phaser.ScaleManager.RESIZE
  game.physics.startSystem(Phaser.Physics.P2)
  game.stage.backgroundColor = '#555'

  const map = game.add.tilemap()

  const bitmap = game.make.bitmapData(TILE_SIZE * 2, TILE_SIZE)
  bitmap.rect(0, 0, TILE_SIZE, TILE_SIZE, '#ff4444')
  bitmap.rect(TILE_SIZE, 0, TILE_SIZE, TILE_SIZE, '#44ff44')
  map.addTilesetImage('tiles', bitmap)

  const layer = map.create('layer', 10, 10, TILE_SIZE, TILE_SIZE)

  map.putTile(TILE_COLORS.RED, 5, 5, layer)
  map.putTile(TILE_COLORS.GREEN, 6, 6, layer)
}

function update () {}
