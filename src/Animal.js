class Animal {
  constructor (x, y, tileSize, game) {
    this.x = x
    this.y = y
    this.health = game.math.between(200, 255)
    this.sprite = game.add.sprite(tileSize * x, tileSize * y, getBlankBitmap(tileSize, game))
  }

  tick () {
    this.health -= 1
    if (this.health < 0) this.health = 0
  }

  render () {
    this.sprite.tint = healthToRgb(this.health)
  }

  destroy () {
    this.sprite.destroy()
  }
}

let bitmap = null
function getBlankBitmap (tileSize, game) {
  if (!bitmap) {
    bitmap = game.make.bitmapData(tileSize, tileSize)
    bitmap.circle(tileSize / 2, tileSize / 2, tileSize / 2, '#ff0000')
  }
  return bitmap
}

function healthToRgb (health) {
  // More health - less brightness.
  let brightness = 255 - health
  // 2-digit hex number (0-255 dec) three times: 56 -> 565656.
  return (brightness * 0x10000) + (brightness * 0x100) + brightness
}

module.exports = Animal
