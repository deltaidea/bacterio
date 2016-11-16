const synaptic = require('synaptic')

class Brain {
  constructor (...layers) {
    if (layers[0] instanceof Brain) this.net = mutate(layers[0].net, 0.1)
    else this.net = mutate(new synaptic.Architect.Perceptron(...layers), 0.3)
    this.net.setOptimize(false)
    // Workaround for a memory leak.
    // https://github.com/cazala/synaptic/issues/164
    this.net.neurons().forEach(n => {
      delete synaptic.Layer.prototype.neurons[n.neuron.ID]
    })

    this.cachedHitsLeft = 0
  }

  ask (inputs) {
    if (this.cachedHitsLeft === 0) {
      this.cachedValue = this.net.activate(inputs)
      this.cachedHitsLeft = 3
    } else {
      this.cachedHitsLeft -= 1
    }
    return this.cachedValue
  }
}

function mutate (net, intensity) {
  let serialized = net.toJSON()
  mutateKey(serialized.neurons, 'bias', intensity)
  mutateKey(serialized.connections, 'weight', intensity)
  return synaptic.Network.fromJSON(serialized)
}

function mutateKey (array, key, intensity) {
  array.forEach(el => {
    if (Math.random() < intensity) {
      el[key] = game.math.clamp(el[key] + (Math.random() - 0.5) * intensity, -0.5, 0.5)
    }
  })
}

module.exports = Brain
