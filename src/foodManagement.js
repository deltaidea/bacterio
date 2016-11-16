const {Noise} = require('noisejs')
const noise = new Noise(Math.random())

module.exports = {
  grow () {
    for (let x = 0; x < game.MAP_SIZE; x++) {
      for (let y = 0; y < game.MAP_SIZE; y++) {
        let tile = game.tiles[x][y]
        let tileYield = noise.perlin3(x / 10, y / 10, game.yearsRunning / 5) * 0.2
        tile.food = game.math.clamp(tile.food + tileYield, 0, 255)
      }
    }
  }
}
