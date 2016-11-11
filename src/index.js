const World = require('./World')
const world = new World(100, 100)

world.initializeRenderer()
world.initializeTiles()
world.generateAnimals(10)
world.render()

function tick () {
  world.tick()
  window.requestAnimationFrame(tick)
}

tick()
