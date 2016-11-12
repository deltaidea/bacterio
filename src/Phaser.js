// Workaround for Phaser's compatibility issues with Webpack.
// https://github.com/photonstorm/phaser/issues/1974
global.PIXI = require('phaser/build/custom/pixi')
global.p2 = require('phaser/build/custom/p2')

module.exports = require('phaser/build/custom/phaser-split')
