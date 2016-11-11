// http://stackoverflow.com/a/1527820/6360623
module.exports = function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
