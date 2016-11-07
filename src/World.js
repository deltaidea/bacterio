const Tile = require('./Tile')
const Pixi = require('pixi.js')

class World {
  constructor (width, height) {
    this.width = width
    this.height = height
    this.tiles = []

    for (let i = 0; i < this.tiles.width; i++) {
      this.tiles[i] = []
      for (let j = 0; j < this.tiles.height; j++) {
        this.tiles[i][j] = new Tile()
      }
    }
  }

  initializeRender () {
    this.renderer = Pixi.autoDetectRenderer(window.innerWidth, window.innerHeight)
    this.renderer.view.style.position = 'absolute'
    this.renderer.view.style.display = 'block'
    this.renderer.autoResize = true
    document.body.appendChild(this.renderer.view)
    this.stage = new Pixi.Container()
    this.renderer.render(this.stage)
  }
}

module.exports = World
