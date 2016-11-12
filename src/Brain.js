const synaptic = require('synaptic')

class Brain {
  constructor (...layers) {
    this.net = mutate(new synaptic.Architect.Perceptron(...layers))
  }

  ask (inputs) {
    return this.net.activate(inputs)
  }
}

function mutate (net) {
  let serialized = net.toJSON()
  mutateKey(serialized.neurons, 'bias')
  mutateKey(serialized.connections, 'weight')
  return synaptic.Network.fromJSON(serialized)
}

function mutateKey (array, key) {
  array.forEach(el => {
    if (Math.random() < 0.2) {
      el[key] = game.math.clamp(el[key] + el[key] * (Math.random() - 0.5) * 3 + Math.random() - 0.5, -0.5, 0.5)
    }
  })
}

module.exports = Brain
