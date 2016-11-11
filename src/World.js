const Tile = require('./Tile')
const Animal = require('./Animal')
const Pixi = require('pixi.js')
const getRandomInt = require('./getRandomInt')

class World {
  constructor (width, height) {
    this.width = width
    this.height = height
  }

  initializeRenderer () {
    this.renderer = Pixi.autoDetectRenderer(window.innerWidth, window.innerHeight)
    this.renderer.view.style.position = 'absolute'
    this.renderer.view.style.display = 'block'
    this.renderer.autoResize = true
    document.body.appendChild(this.renderer.view)
    this.stage = new Pixi.Container()
    this.renderer.backgroundColor = 0x555555
    this.renderer.render(this.stage)
  }

  initializeTiles () {
    this.tiles = []
    for (let x = 0; x < this.width; x++) {
      this.tiles[x] = []
      for (let y = 0; y < this.height; y++) {
        this.tiles[x][y] = new Tile(x, y)
        this.stage.addChild(this.tiles[x][y].rectangle)
      }
    }
  }

  generateAnimals (number) {
    this.animals = []
    for (let i = 0; i < number; i++) {
      let x = getRandomInt(0, this.width - 1)
      let y = getRandomInt(0, this.height - 1)
      let animal = new Animal(x, y)
      this.animals.push(animal)
      this.stage.addChild(animal.rendered)
    }
  }

  render () {
    // Render tiles and animals onto the stage.
    this.tiles.forEach(row => row.forEach(tile => tile.render()))
    this.animals.forEach(a => a.render())
    // Render the stage onto the canvas.
    this.renderer.render(this.stage)
  }

  tick () {
    this.animals.forEach(a => a.move())
    this.render()
  }
}

module.exports = World
