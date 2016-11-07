class Tile {
  constructor () {
    this.food = getRandomInt(0, 255)
  }
}

// http://stackoverflow.com/a/1527820/6360623
function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

module.exports = Tile
