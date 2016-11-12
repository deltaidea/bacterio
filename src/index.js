const Phaser = require('./Phaser')

const game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '', {create, update})

function create () {
  game.scale.scaleMode = Phaser.ScaleManager.RESIZE
  game.physics.startSystem(Phaser.Physics.P2)
  game.stage.backgroundColor = '#555'

  window.map = game.add.tilemap()
}

function update () {}
