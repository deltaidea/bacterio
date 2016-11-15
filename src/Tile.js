class Tile {
  constructor (x, y) {
    this.x = x
    this.y = y
    this.food = game.math.between(0, 50)
    // this.sprite = createRect(game.TILE_SIZE * x, game.TILE_SIZE * y, game.TILE_SIZE, game.TILE_SIZE, '#ffffff')
    this.sprite = game.add.sprite(game.TILE_SIZE * x, game.TILE_SIZE * y, game.cache.getBitmapData('tile' + this.food))
  }

  updateColor () {
    this.sprite.loadTexture(game.cache.getBitmapData('tile' + Math.floor(this.food)))
  }
}

module.exports = Tile
