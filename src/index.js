const World = require('./World')
const world = new World(100, 100)

world.initializeRenderer()
world.initializeTiles()
world.render()
