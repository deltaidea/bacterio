class World {
  constructor (width, height) {
    this.width = width
    this.height = height
    this.tiles = []

    for (let i = 0; i < this.tiles.width; i++) {
      this.tiles[i] = []
      for (let j = 0; j < this.tiles.height; j++) {
        this.tiles[i][j] = generateTile()
      }
    }
  }
}

// http://stackoverflow.com/a/1527820/6360623
function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function generateTile () {
  return getRandomInt(0, 255)
}

module.exports = World
