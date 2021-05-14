import { zeros } from 'mathjs';

function parseNetlistInput(input) {
  return input
    .trim()
    .split('\n')
    .map(row => row.trim().split(' '));
}

function parseResistor(resistor: Resistor) {
  zeros([])

  if (!resistor.positiveNode.ground()) {

  }
}
