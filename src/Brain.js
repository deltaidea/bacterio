const synaptic = require('synaptic')

class Brain {
  constructor (...layers) {
    this.net = mutate(new synaptic.Architect.Perceptron(...layers), 0.8)
  }

  ask (inputs) {
    return this.net.activate(inputs)
  }
}

function mutate (net, intensity) {
  let serialized = net.toJSON()
  mutateKey(serialized.neurons, 'bias')
  mutateKey(serialized.connections, 'weight')
  return synaptic.Network.fromJSON(serialized)
}

function mutateKey (array, key, intensity) {
  array.forEach(el => {
    if (Math.random() < intensity) {
      el[key] = game.math.clamp(el[key] + Math.random() - 0.5, -0.5, 0.5)
    }
  })
}

module.exports = Brain
