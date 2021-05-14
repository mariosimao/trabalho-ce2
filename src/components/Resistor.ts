import { matrix, Matrix, zeros } from 'mathjs';
import Component from './Component';
import Node from '../Node';

export default class Resistor implements Component {
  private readonly name: string;
  private readonly positiveNode: Node;
  private readonly negativeNode: Node;
  private readonly resistance: number;

  constructor(
    name: string,
    positiveNode: Node,
    negativeNode: Node,
    resistance: number,
  ) {
    this.name = name;
    this.positiveNode = positiveNode;
    this.negativeNode = negativeNode;
    this.resistance = resistance;
  }

  // TODO: Move to a factory
  static fromNetlist(netlistRow: string) {
    const values = netlistRow.trim().split(' ');

    return new Resistor(
      values[0],
      new Node(parseInt(values[1])),
      new Node(parseInt(values[2])),
      parseFloat(values[3]),
    );
  }

  private conductance(): number {
    return (1 / this.resistance);
  }

  conductanceMatrix(
    equationSize: number,
    currentExtraDimension: number,
  ): Matrix {
    const conductanceMatrix = matrix(zeros([equationSize, equationSize]));

    const positiveNode = this.positiveNode.matrixNumber();
    const negativeNode = this.negativeNode.matrixNumber();

    if (this.positiveNode.isNotGround()) {
      conductanceMatrix.set(
        [positiveNode, positiveNode],
        this.conductance(),
      );
    }

    if (this.negativeNode.isNotGround()) {
      conductanceMatrix.set(
        [negativeNode, negativeNode],
        this.conductance(),
      );
    }

    if (this.positiveNode.isNotGround() && this.negativeNode.isNotGround()) {
      conductanceMatrix.set(
        [positiveNode, negativeNode],
        this.conductance() * (-1),
      );

      conductanceMatrix.set(
        [negativeNode, positiveNode],
        this.conductance() * (-1),
      );
    }

    return conductanceMatrix;
  }

  currentSourceVector(
    equationSize: number,
    currentExtraDimension: number,
  ): Matrix {
    return  matrix(zeros([equationSize, 0]));
  }

  dimensionsAdded(): number {
    return 0;
  }
}
